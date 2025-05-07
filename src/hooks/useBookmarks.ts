import { useState, useEffect, useCallback } from 'react';
import { Bookmark } from '../types/User';
import {
  subscribeToBookmarks,
  addBookmark as addBookmarkToDb,
  deleteBookmark as deleteBookmarkFromDb,
  incrementBookmarkClickCount,
  updateBookmark as updateBookmarkInDb,
  searchBookmarks as searchBookmarksInDb
} from '../services/bookmarkService';

export const useBookmarks = (userId: string) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Subscribe to bookmarks
  useEffect(() => {
    if (!userId) {
      console.warn('useBookmarks: No userId provided, skipping subscription');
      return () => {};
    }

    console.log(`useBookmarks: Setting up subscription for user ${userId}`);
    setIsLoading(true);
    setBookmarks([]);
    setFilteredBookmarks([]);

    const unsubscribe = subscribeToBookmarks(userId, (newBookmarks) => {
      console.log(`useBookmarks: Received ${newBookmarks.length} bookmarks for user ${userId}`);
      setBookmarks(newBookmarks);
      setIsLoading(false);
    });

    return () => {
      console.log(`useBookmarks: Cleaning up subscription for user ${userId}`);
      unsubscribe();
    };
  }, [userId]);

  // Handle search with debounce
  const performSearch = useCallback(async (query: string) => {
    if (query.trim().length === 0) {
      return bookmarks;
    }
    
    setIsSearching(true);
    try {
      console.log(`Searching for "${query}" among ${bookmarks.length} bookmarks`);
      const results = await searchBookmarksInDb(userId, query);
      console.log(`Search found ${results.length} results for query "${query}"`);
      return results;
    } catch (error) {
      console.error('Error searching bookmarks:', error);
      // Return original bookmarks instead of empty results on error
      return bookmarks;
    } finally {
      setIsSearching(false);
    }
  }, [userId, bookmarks]);

  // Filter bookmarks based on search query, category, and tags
  useEffect(() => {
    const filterBookmarks = async () => {
      setIsLoading(true);
      let filtered = [...bookmarks];
      
      console.log(`Starting filtering process with ${bookmarks.length} bookmarks`);
      console.log(`Current filters - Category: ${selectedCategory}, Tags: ${selectedTags.join(', ')}, Search: ${searchQuery}`);
      
      // Log all bookmarks' categories for debugging
      bookmarks.forEach(bookmark => {
        console.log(`Bookmark ${bookmark.id}: category=${bookmark.category || 'none'}, title=${bookmark.title}`);
      });
      
      // If search query exists, use the search function
      if (searchQuery.trim().length > 0) {
        console.log(`Filtering bookmarks by search query: "${searchQuery}"`);
        filtered = await performSearch(searchQuery);
      }
      
      // Filter by category, favorites, or recent
      if (selectedCategory === 'favorites') {
        console.log('Filtering to show only favorites');
        filtered = filtered.filter(bookmark => bookmark.isFavorite === true);
        console.log(`After favorites filter, ${filtered.length} bookmarks remain`);
      } else if (selectedCategory === 'recent') {
        // Sort by most recently added first (already done below, but keep only the most recent ones)
        console.log('Filtering to show recent bookmarks');
        // No additional filtering needed as we'll sort by date below
      } else if (selectedCategory !== 'all' && selectedCategory) {
        console.log(`Filtering by category: ${selectedCategory}`);
        
        // First log matching bookmarks for debugging
        const matchingBookmarks = filtered.filter(bookmark => bookmark.category === selectedCategory);
        console.log(`Found ${matchingBookmarks.length} bookmarks in category ${selectedCategory}:`);
        matchingBookmarks.forEach(bookmark => {
          console.log(`- ${bookmark.title} (ID: ${bookmark.id}, category: ${bookmark.category})`);
        });
        
        filtered = filtered.filter(bookmark => {
          const matches = bookmark.category === selectedCategory;
          if (!matches && bookmark.category) {
            console.log(`Bookmark ${bookmark.id} has category ${bookmark.category}, not matching ${selectedCategory}`);
          }
          return matches;
        });
        
        console.log(`After category filter, ${filtered.length} bookmarks remain`);
      }
      
      // Filter by tags
      if (selectedTags.length > 0) {
        console.log(`Filtering by tags: ${selectedTags.join(', ')}`);
        filtered = filtered.filter(bookmark => 
          selectedTags.every(tag => bookmark.tags && bookmark.tags.includes(tag))
        );
        console.log(`After tag filter, ${filtered.length} bookmarks remain`);
      }
      
      // Sort by most recently added
      filtered.sort((a, b) => {
        const aTime = a.createdAt && typeof a.createdAt === 'object' && 'toMillis' in a.createdAt
          ? a.createdAt.toMillis()
          : typeof a.createdAt === 'number' ? a.createdAt : 0;
        
        const bTime = b.createdAt && typeof b.createdAt === 'object' && 'toMillis' in b.createdAt
          ? b.createdAt.toMillis()
          : typeof b.createdAt === 'number' ? b.createdAt : 0;
        
        return bTime - aTime;
      });
      
      // If showing recent bookmarks, limit to the 20 most recent
      if (selectedCategory === 'recent') {
        filtered = filtered.slice(0, 20);
        console.log(`Limited to 20 recent bookmarks, ${filtered.length} bookmarks remain`);
      }
      
      console.log(`Setting filtered bookmarks: ${filtered.length} results`);
      setFilteredBookmarks(filtered);
      setIsLoading(false);
    };
    
    filterBookmarks();
  }, [bookmarks, selectedCategory, selectedTags, searchQuery, performSearch]);

  const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt' | 'position' | 'clickCount'>) => {
    try {
      console.log('useBookmarks: Adding bookmark with data:', bookmark);
      
      // Validate bookmark data
      if (!bookmark.url) {
        console.error('useBookmarks: Missing required URL');
        throw new Error('URL is required');
      }
      
      if (!bookmark.title) {
        console.error('useBookmarks: Missing required title');
        throw new Error('Title is required');
      }
      
      // Check if user ID exists before calling the service
      if (!userId) {
        console.error('useBookmarks: Missing userId');
        throw new Error('User ID is required');
      }
      
      const bookmarkId = await addBookmarkToDb(userId, bookmark);
      console.log('useBookmarks: Bookmark added successfully with ID:', bookmarkId);
      return bookmarkId;
    } catch (error) {
      console.error('useBookmarks: Error adding bookmark:', error);
      // Rethrow with a more user-friendly message if needed
      if (error instanceof Error) {
        throw new Error(`Failed to add bookmark: ${error.message}`);
      } else {
        throw new Error('Failed to add bookmark: Unknown error');
      }
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      await deleteBookmarkFromDb(userId, id);
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      throw error;
    }
  };

  const updateBookmark = async (id: string, updates: Partial<Bookmark>) => {
    try {
      await updateBookmarkInDb(userId, id, updates);
    } catch (error) {
      console.error('Error updating bookmark:', error);
      throw error;
    }
  };

  const handleBookmarkClick = async (id: string) => {
    try {
      await incrementBookmarkClickCount(userId, id);
    } catch (error) {
      console.error('Error updating bookmark click count:', error);
    }
  };

  return {
    bookmarks,
    filteredBookmarks,
    isLoading: isLoading || isSearching,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedTags,
    setSelectedTags,
    addBookmark,
    deleteBookmark,
    updateBookmark,
    handleBookmarkClick
  };
}; 