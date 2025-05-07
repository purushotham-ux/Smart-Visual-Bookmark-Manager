import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
  increment,
  writeBatch,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Bookmark, Category, Tag } from '../types/User';

// Collection paths
const getUserBookmarksPath = (userId: string) => `users/${userId}/bookmarks`;
const getUserCategoriesPath = (userId: string) => `users/${userId}/categories`;
const getUserTagsPath = (userId: string) => `users/${userId}/tags`;

// Bookmarks
export const getBookmarks = async (userId: string): Promise<Bookmark[]> => {
  const bookmarksCollection = collection(db, getUserBookmarksPath(userId));
  const q = query(bookmarksCollection, orderBy('position'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Bookmark));
};

export const subscribeToBookmarks = (
  userId: string,
  callback: (bookmarks: Bookmark[]) => void
): Unsubscribe => {
  if (!userId) {
    console.error("Error subscribing to bookmarks: userId is missing or empty");
    callback([]);
    return () => {};
  }

  console.log(`Subscribing to bookmarks for user: ${userId}`);
  const bookmarksCollection = collection(db, getUserBookmarksPath(userId));
  const q = query(bookmarksCollection, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, {
    next: (snapshot) => {
      console.log(`Received ${snapshot.docs.length} bookmarks for user: ${userId}`);
      const bookmarks = snapshot.docs.map(doc => {
        const data = doc.data();
        // Ensure the bookmark has an ID
        if (!data.id) {
          updateDoc(doc.ref, { id: doc.id }).catch(err => 
            console.error("Error updating document ID:", err)
          );
        }
        
        // Log category information for debugging
        if (data.category) {
          console.log(`Bookmark ${doc.id} has category: ${data.category}`);
        } else {
          console.warn(`Bookmark ${doc.id} has no category assigned`);
        }
        
        return {
          id: doc.id,
          ...data
        } as Bookmark;
      });
      
      callback(bookmarks);
    },
    error: (error) => {
      console.error("Error listening to bookmarks:", error);
      callback([]);
    }
  });
};

export const addBookmark = async (
  userId: string,
  bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt' | 'position' | 'clickCount'>
): Promise<string> => {
  try {
    if (!userId) {
      console.error("Error adding bookmark: userId is missing or empty");
      throw new Error("User ID is required to add a bookmark");
    }

    // Ensure no undefined values which Firestore doesn't support
    const sanitizedBookmark = {
      ...bookmark,
      notes: bookmark.notes || null, // Ensure notes is null rather than undefined
    };

    console.log('Starting bookmark creation process for user:', userId);
    console.log('Bookmark data:', JSON.stringify(sanitizedBookmark, null, 2));
    
    const bookmarksCollection = collection(db, getUserBookmarksPath(userId));
    
    // Get the position for the new bookmark
    console.log('Fetching current bookmarks to determine position');
    const q = query(bookmarksCollection);
    const snapshot = await getDocs(q);
    const position = snapshot.size;
    
    // Create timestamp manually to ensure immediate local updates
    const now = Timestamp.now();
    
    // Log the category being used
    if (sanitizedBookmark.category) {
      console.log(`Adding bookmark to category: ${sanitizedBookmark.category}`);
      
      // Verify that the category exists
      const categoriesCollection = collection(db, getUserCategoriesPath(userId));
      const categoryDoc = doc(categoriesCollection, sanitizedBookmark.category);
      const categorySnapshot = await getDocs(query(categoriesCollection, where('id', '==', sanitizedBookmark.category)));
      
      if (categorySnapshot.empty) {
        console.warn(`Category ${sanitizedBookmark.category} not found. Creating a bookmark with potentially invalid category reference.`);
      } else {
        console.log(`Confirmed category ${sanitizedBookmark.category} exists.`);
      }
    } else {
      console.warn('No category specified for this bookmark');
    }
    
    const newBookmark = {
      ...sanitizedBookmark,
      createdAt: now,
      updatedAt: now,
      position,
      clickCount: 0
    };
    
    console.log('Adding bookmark to Firestore:', newBookmark);
    
    const docRef = await addDoc(bookmarksCollection, newBookmark);
    console.log('Bookmark document created with ID:', docRef.id);
    
    // Update the document with its ID to make querying easier
    console.log('Updating document with its ID');
    await updateDoc(docRef, { id: docRef.id });

    // Update tag counts
    if (bookmark.tags && bookmark.tags.length > 0) {
      console.log('Updating tag counts for tags:', bookmark.tags);
      try {
        await updateTagCounts(userId, bookmark.tags);
        console.log('Tag counts updated successfully');
      } catch (tagError) {
        console.error("Error updating tag counts:", tagError);
        // Continue execution even if tag update fails
      }
    }
    
    console.log('Bookmark added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding bookmark:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack);
    }
    throw error;
  }
};

export const updateBookmark = async (
  userId: string,
  bookmarkId: string,
  updates: Partial<Bookmark>
): Promise<void> => {
  try {
    const bookmarkRef = doc(db, getUserBookmarksPath(userId), bookmarkId);
    
    // Sanitize updates to replace undefined with null
    const sanitizedUpdates = { ...updates };
    
    // Handle notes field specifically if it exists in the updates
    if ('notes' in updates) {
      sanitizedUpdates.notes = updates.notes || null;
    }
    
    await updateDoc(bookmarkRef, {
      ...sanitizedUpdates,
      updatedAt: serverTimestamp()
    });
    
    // If tags were updated, update tag counts
    if (updates.tags) {
      // Get the old tags
      const bookmarksCollection = collection(db, getUserBookmarksPath(userId));
      const q = query(bookmarksCollection, where('id', '==', bookmarkId));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const oldBookmark = snapshot.docs[0].data() as Bookmark;
        const oldTags = oldBookmark.tags || [];
        const newTags = updates.tags || [];
        await updateTagCountsOnEdit(userId, oldTags, newTags);
      }
    }
  } catch (error) {
    console.error("Error updating bookmark:", error);
    throw error;
  }
};

export const deleteBookmark = async (
  userId: string,
  bookmarkId: string
): Promise<void> => {
  try {
    // Get the bookmark to be deleted
    const bookmarkRef = doc(db, getUserBookmarksPath(userId), bookmarkId);
    const bookmarksCollection = collection(db, getUserBookmarksPath(userId));
    const q = query(bookmarksCollection, where('id', '==', bookmarkId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const bookmark = snapshot.docs[0].data() as Bookmark;
      
      // Delete the bookmark
      await deleteDoc(bookmarkRef);
      
      // Update bookmark positions
      const batch = writeBatch(db);
      const allBookmarksQuery = query(bookmarksCollection, orderBy('position'));
      const allBookmarksSnapshot = await getDocs(allBookmarksQuery);
      
      allBookmarksSnapshot.docs.forEach(doc => {
        const data = doc.data() as Bookmark;
        if (data.position > bookmark.position) {
          batch.update(doc.ref, { position: data.position - 1 });
        }
      });
      
      await batch.commit();
      
      // Update tag counts
      if (bookmark.tags && bookmark.tags.length > 0) {
        await updateTagCountsOnDelete(userId, bookmark.tags);
      }
    }
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    throw error;
  }
};

export const incrementBookmarkClickCount = async (
  userId: string,
  bookmarkId: string
): Promise<void> => {
  try {
    const bookmarkRef = doc(db, getUserBookmarksPath(userId), bookmarkId);
    
    await updateDoc(bookmarkRef, {
      clickCount: increment(1),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error incrementing bookmark click count:", error);
    throw error;
  }
};

// Categories
export const getCategories = async (userId: string): Promise<Category[]> => {
  const categoriesCollection = collection(db, getUserCategoriesPath(userId));
  const q = query(categoriesCollection, orderBy('position'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Category));
};

export const subscribeToCategories = (
  userId: string,
  callback: (categories: Category[]) => void
): Unsubscribe => {
  const categoriesCollection = collection(db, getUserCategoriesPath(userId));
  const q = query(categoriesCollection, orderBy('position'));
  
  return onSnapshot(q, {
    next: (snapshot) => {
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
      
      callback(categories);
    },
    error: (error) => {
      console.error("Error listening to categories:", error);
    }
  });
};

export const addCategory = async (
  userId: string,
  category: Omit<Category, 'id' | 'position'>
): Promise<string> => {
  try {
    const categoriesCollection = collection(db, getUserCategoriesPath(userId));
    
    // Get the position for the new category
    const q = query(categoriesCollection);
    const snapshot = await getDocs(q);
    const position = snapshot.size;
    
    const docRef = await addDoc(categoriesCollection, {
      ...category,
      position
    });
    
    // Update with ID
    await updateDoc(docRef, { id: docRef.id });
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const updateCategory = async (
  userId: string,
  categoryId: string,
  updates: Partial<Category>
): Promise<void> => {
  try {
    const categoryRef = doc(db, getUserCategoriesPath(userId), categoryId);
    await updateDoc(categoryRef, updates);
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (
  userId: string,
  categoryId: string,
  newCategoryId?: string
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    // Delete the category
    const categoryRef = doc(db, getUserCategoriesPath(userId), categoryId);
    batch.delete(categoryRef);
    
    // Reassign bookmarks to a new category or delete them
    const bookmarksCollection = collection(db, getUserBookmarksPath(userId));
    const q = query(bookmarksCollection, where('category', '==', categoryId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      // If no new category is provided, delete the bookmarks
      if (!newCategoryId) {
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
      } else {
        // Otherwise, update them to the new category
        snapshot.docs.forEach(doc => {
          batch.update(doc.ref, { 
            category: newCategoryId,
            updatedAt: serverTimestamp()
          });
        });
      }
    }
    
    await batch.commit();
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Tags
export const getTags = async (userId: string): Promise<Tag[]> => {
  const tagsCollection = collection(db, getUserTagsPath(userId));
  const snapshot = await getDocs(tagsCollection);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Tag));
};

export const subscribeToTags = (
  userId: string,
  callback: (tags: Tag[]) => void
): Unsubscribe => {
  const tagsCollection = collection(db, getUserTagsPath(userId));
  const q = query(tagsCollection, orderBy('count', 'desc'));
  
  return onSnapshot(q, {
    next: (snapshot) => {
      const tags = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.id,
        ...doc.data()
      } as Tag));
      
      callback(tags);
    },
    error: (error) => {
      console.error("Error listening to tags:", error);
    }
  });
};

// Helper function to update tag counts when adding bookmarks
const updateTagCounts = async (
  userId: string,
  tags: string[]
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    const tagsCollection = collection(db, getUserTagsPath(userId));
    
    for (const tag of tags) {
      const tagRef = doc(tagsCollection, tag);
      
      // Check if the tag exists
      const tagSnapshot = await getDocs(query(tagsCollection, where('name', '==', tag)));
      
      if (tagSnapshot.empty) {
        // Create new tag
        batch.set(tagRef, { 
          name: tag, 
          count: 1 
        });
      } else {
        // Increment count
        batch.update(tagRef, { 
          count: increment(1) 
        });
      }
    }
    
    await batch.commit();
  } catch (error) {
    console.error("Error updating tag counts:", error);
    throw error;
  }
};

// Helper function to update tag counts when editing bookmarks
const updateTagCountsOnEdit = async (
  userId: string,
  oldTags: string[],
  newTags: string[]
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    const tagsCollection = collection(db, getUserTagsPath(userId));
    
    // Get tags that were removed
    const removedTags = oldTags.filter(tag => !newTags.includes(tag));
    
    // Get tags that were added
    const addedTags = newTags.filter(tag => !oldTags.includes(tag));
    
    // Decrement counts for removed tags
    for (const tag of removedTags) {
      const tagRef = doc(tagsCollection, tag);
      batch.update(tagRef, { 
        count: increment(-1) 
      });
    }
    
    // Increment counts for added tags
    for (const tag of addedTags) {
      const tagRef = doc(tagsCollection, tag);
      
      // Check if the tag exists
      const tagSnapshot = await getDocs(query(tagsCollection, where('name', '==', tag)));
      
      if (tagSnapshot.empty) {
        // Create new tag
        batch.set(tagRef, { 
          name: tag, 
          count: 1 
        });
      } else {
        // Increment count
        batch.update(tagRef, { 
          count: increment(1) 
        });
      }
    }
    
    await batch.commit();
  } catch (error) {
    console.error("Error updating tag counts on edit:", error);
    throw error;
  }
};

// Helper function to update tag counts when deleting bookmarks
const updateTagCountsOnDelete = async (
  userId: string,
  tags: string[]
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    const tagsCollection = collection(db, getUserTagsPath(userId));
    
    for (const tag of tags) {
      const tagRef = doc(tagsCollection, tag);
      
      // Decrement the tag count
      batch.update(tagRef, { 
        count: increment(-1) 
      });
    }
    
    await batch.commit();
  } catch (error) {
    console.error("Error updating tag counts on delete:", error);
    throw error;
  }
};

// Import/Export
export const exportBookmarks = async (userId: string): Promise<string> => {
  try {
    // Get all bookmarks
    const bookmarksCollection = collection(db, getUserBookmarksPath(userId));
    const bookmarksSnapshot = await getDocs(bookmarksCollection);
    const bookmarks = bookmarksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get all categories
    const categoriesCollection = collection(db, getUserCategoriesPath(userId));
    const categoriesSnapshot = await getDocs(categoriesCollection);
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Create export object
    const exportData = {
      bookmarks,
      categories,
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error("Error exporting bookmarks:", error);
    throw error;
  }
};

export const importBookmarks = async (
  userId: string,
  jsonData: string
): Promise<void> => {
  try {
    const data = JSON.parse(jsonData);
    const batch = writeBatch(db);
    
    // Import categories first
    if (data.categories && Array.isArray(data.categories)) {
      const categoriesCollection = collection(db, getUserCategoriesPath(userId));
      
      for (const category of data.categories) {
        const { id, ...categoryData } = category;
        const docRef = doc(categoriesCollection, id);
        batch.set(docRef, categoryData);
      }
    }
    
    // Then import bookmarks
    if (data.bookmarks && Array.isArray(data.bookmarks)) {
      const bookmarksCollection = collection(db, getUserBookmarksPath(userId));
      
      for (const bookmark of data.bookmarks) {
        const { id, ...bookmarkData } = bookmark;
        const docRef = doc(bookmarksCollection, id);
        batch.set(docRef, bookmarkData);
      }
    }
    
    await batch.commit();
    
    // Update tags
    if (data.bookmarks && Array.isArray(data.bookmarks)) {
      const allTags = new Set<string>();
      data.bookmarks.forEach((bookmark: { tags?: string[] }) => {
        if (bookmark.tags && Array.isArray(bookmark.tags)) {
          bookmark.tags.forEach((tag: string) => allTags.add(tag));
        }
      });
      
      // Create or update tag counts
      if (allTags.size > 0) {
        await updateTagCounts(userId, Array.from(allTags));
      }
    }
  } catch (error) {
    console.error("Error importing bookmarks:", error);
    throw error;
  }
};

// Search bookmarks function
export const searchBookmarks = async (userId: string, searchTerm: string): Promise<Bookmark[]> => {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      console.log('Empty search term, returning all bookmarks');
      return getBookmarks(userId);
    }
    
    console.log(`Performing search for: "${searchTerm}" for user ${userId}`);
    const bookmarksCollection = collection(db, getUserBookmarksPath(userId));
    const allBookmarks = await getDocs(bookmarksCollection);
    console.log(`Retrieved ${allBookmarks.docs.length} bookmarks to search through`);
    
    // Search is case insensitive
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    
    // Filter bookmarks on the client side
    // In a production app, you would use Firestore's text search capabilities or a dedicated search service like Algolia
    const filteredBookmarks = allBookmarks.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Bookmark))
      .filter(bookmark => {
        // Search in title, URL, notes, and tags
        const titleMatch = bookmark.title?.toLowerCase().includes(normalizedSearchTerm) || false;
        const urlMatch = bookmark.url?.toLowerCase().includes(normalizedSearchTerm) || false;
        const notesMatch = bookmark.notes?.toLowerCase().includes(normalizedSearchTerm) || false;
        const tagsMatch = bookmark.tags?.some(tag => tag.toLowerCase().includes(normalizedSearchTerm)) || false;
        
        // Also check partial word matches
        const titleWords = bookmark.title?.toLowerCase().split(/\s+/) || [];
        const titleWordsMatch = titleWords.some(word => word.startsWith(normalizedSearchTerm));
        
        return titleMatch || urlMatch || notesMatch || tagsMatch || titleWordsMatch;
      });
    
    console.log(`Search found ${filteredBookmarks.length} matches for "${searchTerm}"`);
    return filteredBookmarks;
  } catch (error) {
    console.error("Error searching bookmarks:", error);
    throw error;
  }
}; 