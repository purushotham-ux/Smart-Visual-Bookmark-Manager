import React, { useState, useEffect, useRef } from 'react';
import { Bookmark } from '../types/User';
import { useCategories } from '../hooks/useCategories';
import { useTags } from '../hooks/useTags';
import Button from './ui/Button';
import Icon from './ui/Icon';

interface AddBookmarkModalProps {
  onClose: () => void;
  onAdd: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt' | 'position' | 'clickCount'>) => void;
  userId: string;
  editBookmark?: Bookmark; // Optional prop for editing existing bookmark
}

const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({
  onClose,
  onAdd,
  userId,
  editBookmark
}) => {
  // Get categories and tags from hooks
  const { categories } = useCategories(userId);
  const { tagNames } = useTags(userId);
  
  // Form data state
  const [url, setUrl] = useState<string>(editBookmark?.url || '');
  const [title, setTitle] = useState<string>(editBookmark?.title || '');
  const [description, setDescription] = useState<string>(editBookmark?.notes || '');
  const [category, setCategory] = useState<string>(editBookmark?.category || '');
  const [tags, setTags] = useState<string[]>(editBookmark?.tags || []);
  const [newTag, setNewTag] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>(editBookmark?.imageUrl || '');
  const [favicon, setFavicon] = useState<string>(editBookmark?.favicon || '');
  const [useCustomImage, setUseCustomImage] = useState<boolean>(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRetrieving, setIsRetrieving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(editBookmark ? 2 : 1);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // When the modal opens, focus on the URL input
  useEffect(() => {
    if (activeStep === 1 && urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, []);

  // When URL changes and not in edit mode, try to retrieve metadata
  useEffect(() => {
    if (!editBookmark && url && url.trim() !== '' && isValidUrl(url)) {
      fetchMetadata();
    }
  }, [url]);

  // Handle closing modal with escape key and click outside
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Controlled closing with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };
  
  // Validate URL format
  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (error) {
      return false;
    }
  };

  // Fetch metadata from URL
  const fetchMetadata = async () => {
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIsRetrieving(true);
    setError(null);

    try {
      // Use LinkPreview API or OpenGraph scraper to get metadata
      const apiUrl = `https://api.linkpreview.net/?key=YOUR_API_KEY&q=${encodeURIComponent(url)}`;
      
      // For this demo, we'll simulate the response with more realistic data
      // In a production app, you would use a real API call:
      // const response = await fetch(apiUrl);
      // const data = await response.json();
      
      // Extract domain for demo purposes
      const domain = new URL(url).hostname;
      
      // Simulate API response
      const data = await new Promise<any>((resolve) => {
        setTimeout(() => {
          // Try to determine the site type for better defaults
          const isGithub = domain.includes('github');
          const isYoutube = domain.includes('youtube') || domain.includes('youtu.be');
          const isTwitter = domain.includes('twitter') || domain.includes('x.com');
          const isMedium = domain.includes('medium');
          const isNews = domain.includes('news') || domain.includes('bbc') || 
                        domain.includes('cnn') || domain.includes('nytimes');
          
          const siteName = domain.replace('www.', '').split('.')[0];
          const firstLetter = siteName.charAt(0).toUpperCase();
          const capitalized = firstLetter + siteName.slice(1);
          
          // Default values that will be used if the API doesn't return anything
          const defaultTitle = `${capitalized} - ${isGithub ? 'Repository' : 
            isYoutube ? 'Video' : isTwitter ? 'Post' : isNews ? 'Article' : 'Website'}`;
          
          // Get a reasonable favicon
          const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
          
          // Get a better default image based on the domain
          let imageUrl = '';
          if (isGithub) {
            imageUrl = 'https://github.githubassets.com/images/modules/open_graph/github-mark.png';
          } else if (isYoutube) {
            imageUrl = 'https://www.youtube.com/img/desktop/yt_1200.png';
          } else if (isTwitter) {
            imageUrl = 'https://abs.twimg.com/responsive-web/web/icon-default.3c3b2244.png';
          } else if (isMedium) {
            imageUrl = 'https://miro.medium.com/max/1200/1*jfdwtvU6V6g99q3G7gq7dQ.png';
          } else {
            // Default image or generate a colorful placeholder
            imageUrl = `https://via.placeholder.com/1200x630/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${encodeURIComponent(capitalized)}`;
          }
          
          // Generate some suitable tags based on the domain
          const suggestedTags = [];
          if (isGithub) suggestedTags.push('development', 'github', 'code');
          else if (isYoutube) suggestedTags.push('video', 'youtube', 'media');
          else if (isTwitter) suggestedTags.push('social', 'twitter');
          else if (isNews) suggestedTags.push('news', 'article');
          else suggestedTags.push('web', siteName.toLowerCase());
          
          // Add a few general tags
          suggestedTags.push('bookmark', 'link');
          
          // Generate a plausible description
          const descriptions = [
            `A great resource about ${siteName}`,
            `Information and resources from ${capitalized}`,
            `Visit ${capitalized} for more information`,
            `${capitalized} - ${isGithub ? 'Code repository' : isYoutube ? 'Video content' : 
              isTwitter ? 'Social media post' : isNews ? 'News article' : 'Web resource'}`
          ];
          
          resolve({
            title: defaultTitle,
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            image: imageUrl,
            favicon: faviconUrl,
            url: url,
            siteName: capitalized,
            suggestedTags: suggestedTags
          });
        }, 1500);
      });

      // Update form with metadata
      setTitle(data.title || '');
      setDescription(data.description || '');
      setImageUrl(data.image || '');
      setFavicon(data.favicon || '');
      
      // Filter out tags that already exist in the user's tag collection
      const newSuggestions = data.suggestedTags?.filter((tag: string) => !tagNames.includes(tag)) || [];
      setTagSuggestions(newSuggestions);
      
      // Set default category if none selected
      if (!category && categories.length > 0) {
        // Try to determine a good default category
        const url = new URL(data.url);
        const hostname = url.hostname.toLowerCase();
        
        let defaultCategory = '';
        
        if (hostname.includes('github') || hostname.includes('stackoverflow') || 
            hostname.includes('dev.to') || hostname.includes('gitlab')) {
          defaultCategory = categories.find(c => c.name.toLowerCase() === 'development')?.id || '';
        } else if (hostname.includes('behance') || hostname.includes('dribbble') || 
                  hostname.includes('figma') || hostname.includes('sketch')) {
          defaultCategory = categories.find(c => c.name.toLowerCase() === 'design')?.id || '';
        } else if (hostname.includes('youtube') || hostname.includes('vimeo') || 
                  hostname.includes('netflix') || hostname.includes('spotify')) {
          defaultCategory = categories.find(c => c.name.toLowerCase() === 'entertainment')?.id || '';
        }
        
        // If no match, use the first category
        setCategory(defaultCategory || (categories.length > 0 ? categories[0].id : ''));
      }
      
      // Move to next step
      setActiveStep(2);
    } catch (error) {
      console.error('Error fetching metadata:', error);
      setError('Failed to retrieve information from this URL. Please fill in details manually.');
      
      // Still proceed to step 2, but with minimal info
      const domain = new URL(url).hostname;
      setTitle(domain);
      setFavicon(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`);
      setActiveStep(2);
    } finally {
      setIsRetrieving(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const bookmarkData = {
        url,
        title,
        notes: description,
        category,
        tags,
        imageUrl,
        favicon
      };
      
      await onAdd(bookmarkData);
    } catch (error) {
      console.error('Error saving bookmark:', error);
      setError('Failed to save bookmark. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Handle tag management
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const addSuggestedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagSuggestions(tagSuggestions.filter(t => t !== tag));
    }
  };
  
  // Handle custom image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to storage
      // For this demo, we'll create a local object URL
      const localUrl = URL.createObjectURL(file);
      setImageUrl(localUrl);
    }
  };
  
  // Toggle between auto and custom image
  const toggleImageSource = () => {
    setUseCustomImage(!useCustomImage);
    if (!useCustomImage && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Render based on current step
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
  return (
          <div className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="url"
                  id="url"
                  ref={urlInputRef}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="block w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  autoFocus
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Icon name="search" className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Enter the URL of the website you want to bookmark
              </p>
        </div>
        
            <div className="flex justify-between pt-4">
              <Button
                variant="tertiary"
                onClick={handleClose}
                className="transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={fetchMetadata}
                isLoading={isRetrieving}
                disabled={!url.trim() || isRetrieving}
                className="transition-all duration-200 transform hover:scale-105"
              >
                {editBookmark ? 'Update Details' : 'Fetch Details'}
              </Button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            {/* URL */}
            <div>
              <label htmlFor="url-preview" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL
            </label>
              <div className="flex items-center rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-50 dark:bg-gray-700">
                {favicon && (
                  <img 
                    src={favicon} 
                    alt="" 
                    className="w-5 h-5 mr-2 flex-shrink-0 rounded-sm" 
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                )}
              <input
                  type="url"
                  id="url-preview"
                value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="block w-full bg-transparent border-none focus:ring-0 focus:outline-none dark:text-white"
                />
            </div>
          </div>
          
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white py-2 px-3 transition-all duration-200"
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none py-2 px-3 transition-all duration-200"
            />
          </div>
          
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white py-2 pl-3 pr-10 transition-all duration-200"
            >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                <span
                  key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
                >
                  {tag}
                  <button
                    type="button"
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-primary-400 hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-100 focus:outline-none"
                      onClick={() => removeTag(tag)}
                  >
                      <Icon name="close" size="sm" />
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
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                  className="block flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white py-2 px-3 transition-all duration-200"
              />
              <button
                type="button"
                  onClick={addTag}
                  disabled={!newTag.trim()}
                  className="bg-primary-600 text-white px-3 py-2 rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
              
              {tagSuggestions.length > 0 && (
              <div className="mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Suggested tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {tagSuggestions.map(tag => (
                    <button
                      key={tag}
                      type="button"
                        onClick={() => addSuggestedTag(tag)}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                        <Icon name="plus" size="sm" className="mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
            {/* Thumbnail */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Thumbnail
                </label>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="auto-image"
                    checked={!useCustomImage}
                    onChange={() => setUseCustomImage(false)}
                    className="mr-1"
                  />
                  <label htmlFor="auto-image" className="mr-4 text-xs text-gray-600 dark:text-gray-400">
                    Auto-fetch
            </label>
                  
                  <input
                    type="radio"
                    id="custom-image"
                    checked={useCustomImage}
                    onChange={() => setUseCustomImage(true)}
                    className="mr-1"
                  />
                  <label htmlFor="custom-image" className="text-xs text-gray-600 dark:text-gray-400">
                    Custom upload
                  </label>
                </div>
          </div>
          
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-primary-500 dark:hover:border-primary-500 transition-colors duration-200">
                {imageUrl ? (
                  <div className="text-center w-full">
                    <img 
                      src={imageUrl} 
                      alt={title} 
                      className="mx-auto h-32 object-cover rounded-md mb-2"
                      onError={() => setImageUrl('')}
                    />
                    
                    {useCustomImage && (
            <button
              type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                      >
                        Change image
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <div className="flex justify-center">
                      <Icon name="bookmark" size="lg" className="text-gray-400" />
                    </div>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className={`relative mx-auto cursor-pointer rounded-md bg-white dark:bg-gray-800 font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 focus-within:outline-none ${
                          !useCustomImage ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageUpload}
                          disabled={!useCustomImage}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {error && (
              <div className="bg-error-50 dark:bg-error-900/30 text-error-700 dark:text-error-300 p-3 rounded-md text-sm flex items-start">
                <Icon name="close" className="flex-shrink-0 h-5 w-5 mr-2 text-error-500" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <Button
                variant="secondary" 
                onClick={() => setActiveStep(1)}
                className="transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Back
              </Button>
              <div className="flex space-x-3">
                <Button
                  variant="tertiary"
                  onClick={handleClose}
                  className="transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  disabled={!url.trim() || !title.trim() || isLoading}
                  className="transition-all duration-200 transform hover:scale-105"
                >
                  {editBookmark ? 'Update Bookmark' : 'Save Bookmark'}
                </Button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity ${
            isClosing ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden="true"
        ></div>
        
        {/* Modal panel */}
        <div 
          ref={modalRef}
          className={`relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg ${
            isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Modal header */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {editBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
            </h3>
            <button
              onClick={handleClose}
              className="rounded-full h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Icon name="close" />
            </button>
          </div>
          
          {/* Modal content */}
          <div className="px-4 pt-5 pb-5 sm:p-6">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookmarkModal; 