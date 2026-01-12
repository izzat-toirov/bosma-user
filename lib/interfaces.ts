import { JSX } from "react/jsx-runtime";

// User Interface
export interface User {
  id: number;
  email: string;
  fullName: string;
  avatar: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Category Interface
export interface Category {
  id: number;
  slug: string;
  nameUz: string;
  nameRu: string | null;
  // Computed field for language switching
  name: string;
}

// Newspaper Interface
export interface Newspaper {
  id: number;
  titleUz: string;
  titleRu: string | null;
  issueDate: string;
  pdfUrl: string;
  coverImage: string | null;
  createdAt: string;
  articles?: Article[];
  // Computed field for language switching
  title: string;
}

// Comment Interface
export interface Comment {
  id: number;
  createdAt: string;
  content: string;
  userId: number;
  articleId: number;
  user: Pick<User, 'id' | 'fullName'>;
}

// Article Interface
export interface Article {
  length: number;
  map(arg0: (article: Article) => JSX.Element): import("react").ReactNode;
  id: number;
  createdAt: string;
  updatedAt: string;
  titleUz: string;
  titleRu: string | null;
  contentUz: string;
  contentRu: string | null;
  slug: string;
  categoryId: number;
  authorId: number;
  isPublished: boolean;
  newspaperId: number | null;
  viewCount: number;
  thumbnail: string | null;
  category: Category;
  author: Pick<User, 'id' | 'email' | 'fullName'>;
  newspaper: {
    id: number;
    createdAt: string;
    title: string;
    issueDate: string;
    pdfUrl: string;
    coverImage: string | null;
  } | null;
  comments: Array<Comment>;
  // Computed fields for language switching
  title: string;
  content: string;
}

// Pagination Meta Interface
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// API Response Interfaces
export interface ArticlesResponse {
  data: Article[];
  meta: PaginationMeta;
}

export interface ArticleResponse {
  data: Article;
}

export interface CategoriesResponse {
  data: Category[];
}

export interface CategoryResponse {
  data: Category & {
    articles: Pick<
      Article,
      | 'id'
      | 'titleUz'
      | 'titleRu'
      | 'slug'
      | 'viewCount'
      | 'isPublished'
      | 'createdAt'
    >[];
  };
}

// Auth Interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

// Upload Interface
export interface UploadResponse {
  url: string;
}

// Query Parameters Interfaces
export interface ArticleQueryParams {
  page?: string;
  limit?: string;
  categoryId?: string;
  authorId?: string;
  isPublished?: string;
  newspaperId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}
