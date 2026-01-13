# LinkCore: Backend Implementation Plan

This document outlines the roadmap to transition from the current development server to a production-grade, privacy-hardened Node.js backend.

## 🚀 Tech Stack
- **Runtime**: Node.js 18+ (LTS)
- **Framework**: Express.js
- **Database**: PostgreSQL (Metadata & Encrypted Content)
- **Cache**: Redis (Rate limiting & One-time flags)
- **Storage**: Cloudinary (Binary file blobs)
- **Security**: Argon2 (Password hashing), Helmet.js, Express-rate-limit

## 📊 Database Schema (PostgreSQL)

```sql
CREATE TABLE links (
    id VARCHAR(12) PRIMARY KEY,       -- NanoID (URL-friendly)
    content TEXT,                     -- Ciphertext or Identifier
    type VARCHAR(20) NOT NULL,        -- text, code, file, image
    expires_at TIMESTAMP NOT NULL,    -- Auto-deletion trigger
    max_views INTEGER DEFAULT 0,      -- 0 = Unlimited
    current_views INTEGER DEFAULT 0,  -- Atomic counter
    is_encrypted BOOLEAN DEFAULT FALSE,
    is_one_time BOOLEAN DEFAULT FALSE,
    password_hash TEXT,               -- Argon2id hash (optional)
    file_name TEXT,                   -- Metadata
    file_size BIGINT,
    mime_type TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_expiry ON links(expires_at);
```

## 📡 API Specification

### 1. Create Link
**Endpoint**: `POST /api/links`
- **Logic**: 
    1. Validate payload size (limit: 50MB for text).
    2. Generate 10-char `nanoid`.
    3. Calculate `expires_at` based on frontend preset.
    4. If `is_one_time`, initialize a Redis key `link:active:[id]` with TTL.
    5. Save metadata to Postgres.
- **Response**: `201 Created` with `{ id: "..." }`.

### 2. Retrieve Link
**Endpoint**: `GET /api/links/:id`
- **Logic**:
    1. Fetch metadata from Postgres.
    2. **Check Expiry**: If `now() > expires_at`, return `410 Gone` and trigger background deletion.
    3. **Check One-Time**: Use Redis `GETDEL link:active:[id]`. If null, return `410 Gone`.
    4. **Check Views**: If `max_views > 0` and `current_views >= max_views`, return `410`.
    5. **Atomic Increment**: `UPDATE links SET current_views = current_views + 1`.
- **Response**: `200 OK` with JSON metadata and encrypted content.

### 3. File Download (Proxy)
**Endpoint**: `GET /api/links/:id/download`
- **Logic**:
    1. Verify link is active and valid.
    2. Return Cloudinary signed URL or stream the buffer directly with original MIME headers.

## 🛡️ Security Implementation

### Rate Limiting (Redis)
- **Global**: 100 requests / 15 mins.
- **Link Creation**: 10 links / 1 hour per IP.
- **Password Brute-force**: 5 failed attempts / 10 mins per link.

### Automated Cleanup (Cron Job)
A daily/hourly process to:
1. `DELETE FROM links WHERE expires_at < NOW()`.
2. Delete orphaned files from Cloudinary storage.
3. Flush expired Redis keys.
