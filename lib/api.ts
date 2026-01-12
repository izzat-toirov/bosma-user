import axios from 'axios';

const normalizeApiBaseUrl = (rawUrl: string) => {
  const url = rawUrl.replace(/\/+$/, '');
  return url.endsWith('/api') ? url : `${url}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_API_URL || 'https://gazeta-uz.onrender.com'
); // Backend API root

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('access_token')
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if token expired
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Authentication endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (
    fullName: string,
    email: string,
    password: string,
    avatar?: string,
    role?: string
  ) => api.post('/auth/register', { fullName, email, password, avatar, role }),

  getProfile: () => api.get('/auth/profile'),

  updateProfile: (data: {
    fullName?: string;
    email?: string;
    avatar?: string;
  }) => api.patch('/auth/profile', data),
};

// Articles endpoints
export const articlesAPI = {
  getAll: (params?: {
    page?: string;
    limit?: string;
    categoryId?: string;
    authorId?: string;
    isPublished?: string;
    newspaperId?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => api.get('/articles', { params }),

  getById: (id: number) => api.get(`/articles/${id}`),

  getBySlug: (slug: string) => api.get(`/articles/slug/${slug}`),
};

// Categories endpoints
export const categoriesAPI = {
  getAll: () => api.get('/categories'),

  getById: (id: number) => api.get(`/categories/${id}`),

  getBySlug: (slug: string) => api.get(`/categories/slug/${slug}`),
};

// Comments endpoints
export const commentsAPI = {
  getComments: (articleId?: number) =>
    api.get('/comments', {
      params: articleId ? { articleId } : undefined,
    }),

  addComment: (articleId: number, content: string) =>
    api.post('/comments', {
      text: content,
      articleId,
    }),

  deleteComment: (commentId: number) => api.delete(`/comments/${commentId}`),
};

// Newspapers endpoints
export const newspapersAPI = {
  getAll: (params: {
    page?: string;
    limit?: string;
    fromDate?: string;
    toDate?: string;
  }) => api.get('/newspapers', { params }),

  getById: (id: number) => api.get(`/newspapers/${id}`),

  getByTitle: (title: string) => api.get(`/newspapers/title/${title}`),
};

// Upload endpoints
export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadPdf: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
