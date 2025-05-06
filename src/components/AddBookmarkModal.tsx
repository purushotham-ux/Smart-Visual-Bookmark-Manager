import React, { useState, useEffect, useRef } from 'react';
import { Bookmark } from '../types/User';
import { isValidUrl, formatUrl, getFaviconUrl } from '../utils/url';

interface AddBookmarkModalProps {
  categories: { id: string; name: string }[];
  tags: string[];
  onAdd: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt' | 'position' | 'clickCount'>) => Promise<void>;
  onClose: () => void;
}

const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({
  categories,
  tags,
  onAdd,
  onClose
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState(true);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // Set default category if available
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].id);
    }
  }, [categories, category]);
  
  // Auto-focus the URL input when the modal opens
  useEffect(() => {
    urlInputRef.current?.focus();
  }, []);

  // Auto-fetch title when a valid URL is entered and the title field is empty
  useEffect(() => {
    const fetchTitle = async () => {
      if (!url || !isValidUrl(url) || title || isFetchingTitle) return;
      
      setIsFetchingTitle(true);
      
      try {
        // Extract domain from URL
        const domain = new URL(formatUrl(url)).hostname.replace('www.', '');
        // Use the domain name as the title
        setTitle(domain.charAt(0).toUpperCase() + domain.slice(1));
      } catch (error) {
        console.error('Error setting title:', error);
      } finally {
        setIsFetchingTitle(false);
      }
    };
    
    fetchTitle();
  }, [url, title, isFetchingTitle]);
  
  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setIsUrlValid(value === '' || isValidUrl(value));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError('Title is required');
      titleInputRef.current?.focus();
      return;
    }
    
    if (!url.trim()) {
      setError('URL is required');
      urlInputRef.current?.focus();
      return;
    }
    
    if (!isUrlValid) {
      setError('Please enter a valid URL');
      urlInputRef.current?.focus();
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formattedUrl = formatUrl(url.trim());
      const favicon = getFaviconUrl(formattedUrl);
      
      const bookmarkData = {
        title: title.trim(),
        url: formattedUrl,
        category,
        tags: selectedTags,
        notes: notes.trim() || null,
        favicon
      };
      
      console.log('AddBookmarkModal: Submitting bookmark with data:', bookmarkData);
      
      await onAdd(bookmarkData);
      
      // Success - clear form
      setTitle('');
      setUrl('');
      setNotes('');
      setSelectedTags([]);
      
    } catch (error) {
      console.error('AddBookmarkModal: Error adding bookmark:', error);
      
      // Set a more specific error message if available
      if (error instanceof Error) {
        setError(`Failed to add bookmark: ${error.message}`);
      } else {
        setError('Failed to add bookmark. Please try again.');
      }
      
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };
  
  const handleTagClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Filter out already selected tags
  const filteredTags = tags.filter(tag => !selectedTags.includes(tag));
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef}
        className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-medium text-white">Add Bookmark</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 focus:outline-none"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-2 bg-red-900 bg-opacity-50 border border-red-700 text-red-200 rounded">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
              URL *
            </label>
            <div className="relative">
              <input
                ref={urlInputRef}
                type="text"
                id="url"
                value={url}
                onChange={handleUrlChange}
                className={`w-full px-3 py-2 border ${isUrlValid ? 'border-gray-600' : 'border-red-800'} rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white`}
                placeholder="https://example.com"
                required
              />
              {!isUrlValid && (
                <p className="mt-1 text-xs text-red-400">
                  Please enter a valid URL
                </p>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Title *
            </label>
            <input
              ref={titleInputRef}
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
              placeholder="My Bookmark"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap mb-2 gap-1">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-purple-900 text-purple-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-purple-300 hover:text-white"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 border border-l-0 border-gray-600 rounded-r-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Add
              </button>
            </div>
            {filteredTags.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-400 mb-1">Suggested tags:</p>
                <div className="flex flex-wrap gap-1">
                  {filteredTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-700 text-gray-300 hover:bg-purple-900 hover:text-purple-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
              placeholder="Add some notes (optional)"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : 'Add Bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookmarkModal; 