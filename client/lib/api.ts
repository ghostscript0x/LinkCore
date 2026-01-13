
import { LinkObject, CreateLinkOptions, ContentType } from '../types';

// In this environment, we assume the API is available at the same origin or via proxy
const API_BASE = '/api';

export const api = {
  createLink: async (
    content: string, 
    type: ContentType, 
    options: CreateLinkOptions,
    fileMeta?: { name: string; size: number; mime: string }
  ): Promise<string> => {
    const response = await fetch(`${API_BASE}/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, type, options, fileMeta })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to create link');
    }

    const data = await response.json();
    return data.id;
  },

  getLink: async (id: string, password?: string): Promise<LinkObject> => {
    let url = `${API_BASE}/links/${id}`;
    const params = new URLSearchParams();
    if (password) params.append('password', password);
    
    const query = params.toString();
    if (query) url += `?${query}`;

    const response = await fetch(url);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to fetch link');
    }

    return await response.json();
  }
};
