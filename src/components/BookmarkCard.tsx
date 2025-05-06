import React, { useState } from 'react';
import Icon from './ui/Icon';
import { Bookmark } from '../types/User';
import { Timestamp } from 'firebase/firestore';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
  aspectRatio?: '16:9' | '4:3' | '1:1';
  isFeatured?: boolean;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  onDelete,
  onClick,
  aspectRatio = '16:9',
  isFeatured = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Format the domain from the URL
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch (error) {
      return url;
    }
  };
  
  // Determine aspect ratio class
  const aspectRatioClass = {
    '16:9': 'aspect-w-16 aspect-h-9',
    '4:3': 'aspect-w-4 aspect-h-3',
    '1:1': 'aspect-w-1 aspect-h-1',
  }[aspectRatio];
  
  // Format time since creation (e.g. "2 days ago")
  const getTimeSince = (timestamp: Date | number | Timestamp) => {
    let date: Date;
    
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
      date = timestamp.toDate();
    } else {
      return 'Unknown date';
    }
    
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    
    return `${Math.floor(seconds)} seconds ago`;
  };

  // Get appropriate color for category
  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-gray-500';
    
    const colors: Record<string, string> = {
      development: 'bg-blue-500',
      design: 'bg-purple-500',
      productivity: 'bg-green-500',
      entertainment: 'bg-pink-500',
      social: 'bg-yellow-500',
      default: 'bg-gray-500'
    };
    
    return colors[category] || colors.default;
  };

  // Handle card click
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent click if coming from action buttons
    if ((e.target as HTMLElement).closest('.bookmark-actions')) {
      return;
    }
    onClick(bookmark.id);
  };
  
  // Handle delete with confirmation
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${bookmark.title}"?`)) {
      onDelete(bookmark.id);
    }
  };
  
  // Handle favorite
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement favorite functionality
    console.log('Favorite', bookmark.id);
  };
  
  // Handle edit
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement edit functionality
    console.log('Edit', bookmark.id);
  };
  
  // Handle share
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement share functionality
    console.log('Share', bookmark.id);
  };
  
  // Handle image load
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };
  
  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className={`
        group relative rounded-lg overflow-hidden bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700
        ${isFeatured ? 'shadow-lg scale-105' : 'shadow-sm hover:shadow-lg hover:scale-[1.02]'}
        transition-all duration-300 ease-in-out
        ${isFeatured ? 'z-10' : ''}
      `}
      style={{ height: 'fit-content' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Category Indicator */}
      <div className={`absolute top-0 left-0 w-full h-1 ${getCategoryColor(bookmark.category)}`}></div>
      
      {/* Thumbnail Section */}
      <div className={`${aspectRatioClass} bg-gray-100 dark:bg-gray-900 overflow-hidden`}>
        {bookmark.imageUrl && !imageError ? (
          <>
            {/* Skeleton loader */}
            <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse ${isImageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}></div>
            
            <img 
              src={bookmark.imageUrl} 
              alt={bookmark.title}
              className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700 p-4">
            <Icon name={bookmark.category === 'development' ? 'code' : bookmark.category === 'design' ? 'edit' : 'bookmark'} 
                  size="lg" 
                  className="text-gray-400 dark:text-gray-500 mb-2" />
            <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {imageError ? 'Failed to load thumbnail' : 'No thumbnail available'}
            </span>
          </div>
        )}
        
        {/* Hover Overlay with Actions */}
        <div 
          className={`
            absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent 
            opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out
            flex items-end justify-between p-3
          `}
        >
          <div className="bookmark-actions flex space-x-2">
            <ActionButton onClick={handleFavorite} icon="star" tooltip="Favorite" />
            <ActionButton onClick={handleEdit} icon="edit" tooltip="Edit" />
            <ActionButton onClick={handleShare} icon="share" tooltip="Share" />
            <ActionButton onClick={handleDelete} icon="delete" tooltip="Delete" />
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          {/* Title and URL */}
          <div className="flex-1 min-w-0">
            <h3 className="text-h4 font-medium text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
              {bookmark.title}
            </h3>
            <div className="flex items-center mt-1 text-small text-gray-500 dark:text-gray-400">
              {bookmark.favicon && (
                <img 
                  src={bookmark.favicon} 
                  alt="" 
                  className="w-4 h-4 mr-1.5 rounded-sm" 
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              <span className="truncate">
                {getDomain(bookmark.url)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Description - only show if available */}
        {bookmark.notes && (
          <p className="mt-2 text-small text-gray-600 dark:text-gray-300 line-clamp-2">
            {bookmark.notes}
          </p>
        )}
        
        {/* Tags */}
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {bookmark.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-micro font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
            {bookmark.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-micro font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                +{bookmark.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Footer: Metadata */}
        <div className="mt-3 flex items-center justify-between text-micro text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <Icon name="clock" size="sm" className="mr-1" />
            {bookmark.createdAt && getTimeSince(bookmark.createdAt)}
          </span>
          <div className="flex items-center">
            <Icon name="bookmark" size="sm" className="mr-1" />
            <span>{bookmark.clickCount || 0} views</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void;
  icon: string;
  tooltip: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon, tooltip }) => {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center text-white transition-colors duration-200 transform hover:scale-110"
      title={tooltip}
    >
      <Icon name={icon as any} size="sm" />
    </button>
  );
};

export default BookmarkCard; 