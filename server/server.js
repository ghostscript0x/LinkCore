
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { Pool } = require('pg');
const Redis = require('ioredis');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and Parsers
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));

// Services Setup
// In local development, ensure DATABASE_URL and REDIS_URL are set
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const redis = new Redis(process.env.REDIS_URL);

// --- API Endpoints ---

// Create a link
app.post('/api/links', async (req, res) => {
  const { content, type, options, fileMeta } = req.body;
  const id = nanoid(10);
  
  try {
    const expiryMap = { '1h': 1, '24h': 24, '7d': 168, '30d': 720 };
    const expiresAt = new Date(Date.now() + (expiryMap[options.expiry] || 24) * 3600000);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const q = `INSERT INTO links (id, content, type, expires_at, max_views, is_encrypted, is_one_time, file_name, file_size, mime_type) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
      await client.query(q, [id, content, type, expiresAt, options.maxViews || 0, options.encrypt, options.oneTime, fileMeta?.name, fileMeta?.size, fileMeta?.mime]);
      
      // Atomic one-time flag in Redis
      if (options.oneTime) {
        await redis.set(`one-time:${id}`, '0', 'EX', (expiryMap[options.expiry] || 24) * 3600);
      }
      
      await client.query('COMMIT');
      res.status(201).json({ id });
    } catch (dbErr) {
      await client.query('ROLLBACK');
      throw dbErr;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Retrieve a link
app.get('/api/links/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM links WHERE id = $1', [id]);
    const link = rows[0];

    if (!link) return res.status(404).json({ error: 'Secure object not found' });
    if (new Date(link.expires_at) < new Date()) return res.status(410).json({ error: 'Resource has expired' });
    if (link.max_views > 0 && link.current_views >= link.max_views) return res.status(410).json({ error: 'View limit exceeded' });

    // Atomic one-time check
    if (link.is_one_time) {
      const viewed = await redis.get(`one-time:${id}`);
      if (viewed === '1') return res.status(410).json({ error: 'One-time link already consumed' });
      await redis.set(`one-time:${id}`, '1', 'KEEPTTL');
    }

    // Increment view count
    await pool.query('UPDATE links SET current_views = current_views + 1 WHERE id = $1', [id]);

    res.json({
      id: link.id,
      content: link.content,
      type: link.type,
      expiresAt: link.expires_at,
      maxViews: link.max_views,
      currentViews: link.current_views + 1,
      isEncrypted: link.is_encrypted,
      isOneTime: link.is_one_time,
      fileName: link.file_name,
      fileSize: link.file_size
    });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'LinkCore online' }));

app.listen(PORT, () => console.log(`LinkCore API running on port ${PORT}`));
