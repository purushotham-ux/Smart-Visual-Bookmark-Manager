import { useState, useEffect } from 'react';
import { Tag } from '../types/User';
import { subscribeToTags } from '../services/bookmarkService';

export const useTags = (userId: string) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Subscribe to tags
  useEffect(() => {
    const unsubscribe = subscribeToTags(userId, (newTags) => {
      setTags(newTags);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  // Get tag names as array of strings (for simpler use in components)
  const tagNames = tags.map(tag => tag.name);

  return {
    tags,
    tagNames,
    isLoading
  };
}; 