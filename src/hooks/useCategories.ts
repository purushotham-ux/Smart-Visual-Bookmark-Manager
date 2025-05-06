import { useState, useEffect } from 'react';
import { Category } from '../types/User';
import {
  subscribeToCategories,
  addCategory as addCategoryToDb,
  updateCategory as updateCategoryInDb,
  deleteCategory as deleteCategoryFromDb
} from '../services/bookmarkService';

export const useCategories = (userId: string) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Subscribe to categories
  useEffect(() => {
    const unsubscribe = subscribeToCategories(userId, async (newCategories) => {
      setCategories(newCategories);
      setIsLoading(false);
      
      // Create default categories if none exist
      if (newCategories.length === 0) {
        try {
          await addCategoryToDb(userId, { name: 'General', icon: '📄' });
          await addCategoryToDb(userId, { name: 'Work', icon: '💼' });
          await addCategoryToDb(userId, { name: 'Personal', icon: '🏠' });
        } catch (error) {
          console.error('Error creating default categories:', error);
        }
      }
    });

    return unsubscribe;
  }, [userId]);

  const addCategory = async (category: Omit<Category, 'id' | 'position'>) => {
    try {
      const categoryId = await addCategoryToDb(userId, category);
      return categoryId;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      await updateCategoryInDb(userId, id, updates);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string, newCategoryId?: string) => {
    try {
      await deleteCategoryFromDb(userId, id, newCategoryId);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  return {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory
  };
}; 