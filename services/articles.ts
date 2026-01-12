'use server';

import { ArticlesResponse, ArticleQueryParams } from '@/lib/interfaces';
import api from '@/lib/api';

// Function to fetch articles from the backend API
export async function getArticles(
  params?: ArticleQueryParams
): Promise<ArticlesResponse> {
  try {
    const response = await api.get('/articles', { params });

    const payload = response.data;
    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

    // Process articles to handle language switching
    const processedData =
      items?.map((article: any) => ({
        ...article,
        title: article.titleUz, // Default to Uzbek
        content: article.contentUz, // Default to Uzbek
      })) || [];

    return {
      data: processedData,
      meta: payload?.meta || { page: 1, limit: 10, total: 0, pages: 1 },
    };
  } catch (error) {
    console.error('Network error when fetching articles:', error);
    return {
      data: [],
      meta: { page: 1, limit: 10, total: 0, pages: 1 },
    };
  }
}

// Function to get a single article by ID
export async function getArticleById(id: number) {
  try {
    const response = await api.get(`/articles/${id}`);

    // Process article to handle language switching
    const processedData = response.data
      ? {
          ...response.data,
          title: response.data.titleUz, // Default to Uzbek
          content: response.data.contentUz, // Default to Uzbek
        }
      : null;

    return {
      data: processedData,
    };
  } catch (error) {
    console.error('Network error when fetching article:', error);
    return { data: null };
  }
}

// Function to get a single article by slug
export async function getArticleBySlug(slug: string) {
  try {
    const response = await api.get(`/articles/slug/${slug}`);

    // Process article to handle language switching
    const processedData = response.data
      ? {
          ...response.data,
          title: response.data.titleUz, // Default to Uzbek
          content: response.data.contentUz, // Default to Uzbek
        }
      : null;

    return {
      data: processedData,
    };
  } catch (error) {
    console.error('Network error when fetching article by slug:', error);
    return { data: null };
  }
}
