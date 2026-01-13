# LinkCore: Project Documentation

LinkCore is a privacy-first, ephemeral link-sharing platform designed for high-security, zero-knowledge data transmission. This document details the technical implementation and architectural decisions.

## 🏗️ Architecture Overview

The application follows a decoupled SPA (Single Page Application) architecture:
- **Frontend**: React 18+ with Tailwind CSS, utilizing Web Crypto API for client-side security.
- **Backend**: (Plan) Node.js Express server with PostgreSQL for persistence and Redis for ephemeral state.
- **Security Model**: Zero-Knowledge. The server never sees plaintext content or encryption keys.

## 🔐 Security & Encryption (The "Zero-Knowledge" Protocol)

LinkCore implements a specific protocol to ensure data privacy:

1. **Key Generation**: When a user selects "Encrypted", `client/lib/crypto.ts` generates a 256-bit AES-GCM key locally.
2. **Encryption**: Content is encrypted in-browser. A random 12-byte IV (Initialization Vector) is generated and prepended to the ciphertext.
3. **Transmission**: Only the ciphertext (Base64) is sent to the `/api/links` endpoint.
4. **Link Construction**: The encryption key is exported to Base64 and appended to the URL as a **location hash fragment** (`#/v/id#key=...`).
5. **Privacy Layer**: Browsers **do not send hash fragments to servers**. Thus, the key never leaves the client's memory or the recipient's URL bar.

## 📁 File Structure

```text
/
├── client/             # Frontend source
│   ├── components/     # Reusable UI components (Button, etc.)
│   ├── lib/            # Core logic (API, Crypto, Utilities)
│   ├── views/          # Page-level components (Home, ViewLink, Privacy)
│   ├── App.tsx         # Main entry, Routing, and Layout
│   └── types.ts        # Global TypeScript definitions
├── server/             # Backend source (Node.js)
│   └── server.js       # Express server entry point
├── index.tsx           # React mounting point
└── documentation.md    # You are here
```

## 🛠️ Core Utilities

### `crypto.ts`
Handles all cryptographic operations. It uses `SubtleCrypto` for hardware-accelerated encryption.
- `generateEncryptionKey()`: Creates non-extractable keys for transient use.
- `encryptContent()`: Implements AES-GCM with IV prepending.
- `decryptContent()`: Extracts IV and decrypts ciphertext.

### `api.ts`
A standardized interface for backend communication. 
- `createLink()`: Handles payload construction for text and file metadata.
- `getLink()`: Fetches metadata and content, handles password validation if necessary.

## 🎨 UI/UX Design System
- **Theme**: Dark-mode focused using Slate/Cyan palette.
- **Icons**: Lucide-React for consistent, accessible iconography.
- **Responsiveness**: Mobile-first design using Tailwind's grid and flex utilities.
- **Feedback**: Optimistic UI states and loading spinners for all async actions.
