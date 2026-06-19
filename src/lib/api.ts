import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kv_token');
      localStorage.removeItem('kv_user');
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  name?: string | null;
}

export interface Document {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  statusMessage?: string | null;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  total: number;
  completed: number;
  processing: number;
  failed: number;
  totalChunks: number;
}

export interface SearchResult {
  content: string;
  chunkIndex: number;
  similarity: number;
  documentId?: string;
  documentName?: string;
  originalName?: string;
}

export interface ChatSource {
  content: string;
  chunkIndex: number;
  similarity: number;
}

export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post<{ user: User; token: string }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ user: User; token: string }>('/auth/login', data),
  me: () => api.get<{ user: User }>('/auth/me'),
};

export const documentApi = {
  list: () => api.get<{ documents: Document[] }>('/documents'),
  get: (id: string) => api.get<{ document: Document }>(`/documents/${id}`),
  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/documents/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: string) => api.delete(`/documents/${id}`),
  stats: () => api.get<{ stats: Stats }>('/documents/stats'),
};

export const chatApi = {
  send: (documentId: string, message: string) =>
    api.post<{ answer: string; sources: ChatSource[] }>('/chat', { documentId, message }),
};

export const searchApi = {
  document: (documentId: string, query: string) =>
    api.post<{ results: SearchResult[] }>('/search/document', { documentId, query }),
  all: (query: string) =>
    api.post<{ results: SearchResult[] }>('/search/all', { query }),
};

export const generateApi = {
  create: (documentId: string, type: string) =>
    api.post<{ type: string; content: unknown }>('/generate', { documentId, type }),
};

export default api;
