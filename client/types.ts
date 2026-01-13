export type ContentType = 'text' | 'code' | 'file' | 'image';

export interface LinkMetadata {
  id: string;
  type: ContentType;
  expiresAt: string;
  maxViews: number;
  currentViews: number;
  isEncrypted: boolean;
  isOneTime: boolean;
  isPasswordProtected: boolean;
  downloadOnly?: boolean;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
}

export interface LinkObject extends LinkMetadata {
  content: string; // Plaintext or Ciphertext
}

export interface CreateLinkOptions {
  expiry: '1h' | '24h' | '7d' | '30d';
  maxViews: number;
  password?: string;
  encrypt: boolean;
  oneTime: boolean;
  downloadOnly: boolean;
}

export enum ExpiryLabels {
  '1h' = '1 Hour',
  '24h' = '24 Hours',
  '7d' = '7 Days',
  '30d' = '30 Days'
}