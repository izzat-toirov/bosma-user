'use server';

import { CategoriesResponse } from '@/lib/interfaces';
import api from '@/lib/api';

// Function to fetch all categories from the backend API
export async function getCategories(): Promise<CategoriesResponse> {
  try {
    const response = await api.get('/categories');

    // Process categories to handle language switching
    const processedData =
      response.data.data?.map((category: any) => ({
        ...category,
        name: category.nameUz, // Default to Uzbek
      })) || [];

    // Ensure the response matches the expected interface
    return {
      data: processedData,
    };
  } catch (error) {
    console.error('Network error when fetching categories:', error);
    return {
      data: [],
    };
  }
}

// Function to get a single category by ID
export async function getCategoryById(id: number) {
  try {
    const response = await api.get(`/categories/${id}`);

    // Process category to handle language switching
    const processedData = response.data
      ? {
          ...response.data,
          name: response.data.nameUz, // Default to Uzbek
        }
      : null;

    return {
      data: processedData,
    };
  } catch (error) {
    console.error('Network error when fetching category:', error);
    return { data: null };
  }
}

// Function to get a single category by slug
export async function getCategoryBySlug(slug: string) {
  try {
    const response = await api.get(`/categories/slug/${slug}`);

    // Process category to handle language switching
    const processedData = response.data
      ? {
          ...response.data,
          name: response.data.nameUz, // Default to Uzbek
        }
      : null;

    return {
      data: processedData,
    };
  } catch (error) {
    console.error('Network error when fetching category by slug:', error);
    return { data: null };
  }
}
