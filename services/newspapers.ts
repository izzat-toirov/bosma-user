'use server';

import { newspapersAPI } from '@/lib/api';
import { Newspaper } from '@/lib/interfaces';

// Function to fetch all newspapers from the backend API
export async function getNewspapers(): Promise<{ data: Newspaper[] }> {
  try {
    const response = await newspapersAPI.getAll({ page: '1', limit: '50' });

    const payload = response.data;
    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

    // Process newspapers to handle language switching
    const processedData =
      items?.map((newspaper: any) => ({
        ...newspaper,
        title: newspaper.titleUz || newspaper.title || '', // Default to Uzbek title
      })) || [];

    return {
      data: processedData,
    };
  } catch (error) {
    console.error('Network error when fetching newspapers:', error);
    return {
      data: [],
    };
  }
}

// Function to get a single newspaper by ID
export async function getNewspaperById(id: number) {
  try {
    const response = await newspapersAPI.getById(id);

    // Process newspaper to handle language switching
    const processedData = response.data
      ? {
          ...response.data,
          title: response.data.titleUz || response.data.title || '', // Default to Uzbek title
        }
      : null;

    return {
      data: processedData,
    };
  } catch (error) {
    console.error('Network error when fetching newspaper:', error);
    return { data: null };
  }
}

// Function to get a single newspaper by title
export async function getNewspaperByTitle(title: string) {
  try {
    const response = await newspapersAPI.getByTitle(title);

    // Process newspaper to handle language switching
    const processedData = response.data
      ? {
          ...response.data,
          title: response.data.titleUz || response.data.title || '', // Default to Uzbek title
        }
      : null;

    return {
      data: processedData,
    };
  } catch (error) {
    console.error('Network error when fetching newspaper by title:', error);
    return { data: null };
  }
}
