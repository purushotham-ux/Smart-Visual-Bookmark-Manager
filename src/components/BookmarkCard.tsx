import React, { useState } from 'react';
import Icon from './ui/Icon';
import { Bookmark } from '../types/User';
import { Timestamp } from 'firebase/firestore';
import { IconName } from './ui/Icon';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
  onEdit: (bookmark: Bookmark) => void;
  aspectRatio?: '16:9' | '4:3' | '1:1';
  isFeatured?: boolean;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  onDelete,
  onClick,
  onEdit,
  aspectRatio = '16:9',
  isFeatured = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(bookmark.isFavorite || false);
  
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

  // Handle card click - open the URL in a new tab
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent click if coming from action buttons
    if ((e.target as HTMLElement).closest('.bookmark-actions')) {
      return;
    }
    
    // Open the bookmark URL in a new tab
    window.open(bookmark.url, '_blank');
    
    // Also trigger the original onClick for analytics/tracking
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
    setIsFavorite(!isFavorite);
    
    // In a real app, you would update this in your database
    console.log('Toggle favorite for', bookmark.id, 'New state:', !isFavorite);
    
    // For demo purposes, we'll update the bookmark object locally
    bookmark.isFavorite = !isFavorite;
  };
  
  // Handle edit
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(bookmark);
  };
  
  // Handle image load
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };
  
  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get category icon
  const getCategoryIcon = (category?: string): IconName => {
    if (!category) return 'bookmark';
    
    const icons: Record<string, IconName> = {
      development: 'code',
      design: 'edit',
      productivity: 'settings',
      entertainment: 'video',
      social: 'share',
      default: 'bookmark'
    };
    
    return icons[category] || icons.default;
  };

  return (
    <div 
      className={`
        group relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700
        ${isFeatured ? 'shadow-xl scale-105' : 'shadow-md hover:shadow-xl hover:translate-y-[-5px]'}
        transition-all duration-300 ease-in-out cursor-pointer h-full w-full
        ${isFeatured ? 'z-10' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Favorite Indicator */}
      {isFavorite && (
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-primary-500 shadow-lg text-white p-1.5 rounded-full">
            <Icon name="star" size="sm" />
          </div>
        </div>
      )}
      
      {/* Category Indicator */}
      <div className={`absolute top-0 left-0 w-full h-1.5 ${getCategoryColor(bookmark.category)}`}></div>
      
      {/* Thumbnail Section */}
      <div className={`${aspectRatioClass} bg-gray-100 dark:bg-gray-900 overflow-hidden relative`}>
        {bookmark.imageUrl && !imageError ? (
          <>
            {/* Gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent z-10"></div>
            
            {/* Skeleton loader */}
            <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse ${isImageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}></div>
            
            <img 
              src={bookmark.imageUrl} 
              alt={bookmark.title}
              className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* Domain overlay */}
            <div className="absolute bottom-2 left-3 z-10 flex items-center bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
              {bookmark.favicon && (
                <img 
                  src={bookmark.favicon} 
                  alt="" 
                  className="w-4 h-4 mr-1.5 rounded-sm" 
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              <span className="text-xs text-white truncate font-medium">
                {getDomain(bookmark.url)}
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 p-4">
            {bookmark.favicon ? (
              <img 
                src={bookmark.favicon}
                alt=""
                className="w-14 h-14 mb-3"
                onError={(e) => {
                  (e.currentTarget.style.display = 'none');
                  document.getElementById(`fallback-icon-${bookmark.id}`)?.classList.remove('hidden');
                }}
              />
            ) : (
              <Icon 
                id={`fallback-icon-${bookmark.id}`}
                name={getCategoryIcon(bookmark.category)} 
                size="xl" 
                className="text-gray-500 dark:text-gray-400 mb-3" 
              />
            )}
            <span className="text-base text-gray-600 dark:text-gray-300 text-center font-medium">
              {getDomain(bookmark.url)}
            </span>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          {/* Title and URL */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-1.5 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
              {bookmark.title}
            </h3>
          </div>
        </div>
        
        {/* Tags */}
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {bookmark.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
            {bookmark.tags.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                +{bookmark.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Footer: Metadata and Action Buttons */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Icon name="clock" size="sm" className="mr-1.5" />
            {bookmark.createdAt && getTimeSince(bookmark.createdAt)}
          </span>
          
          {/* Action Buttons */}
          <div className="bookmark-actions flex space-x-3">
            <ActionButton 
              onClick={handleFavorite} 
              icon="star" 
              tooltip="Favorite" 
              isActive={isFavorite}
            />
            <ActionButton onClick={handleEdit} icon="edit" tooltip="Edit" />
            <ActionButton onClick={handleDelete} icon="delete" tooltip="Delete" />
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
  isActive?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon, tooltip, isActive = false }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 
        transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${isActive 
          ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300' 
          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}
      `}
      title={tooltip}
    >
      <Icon name={icon as any} size="md" />
    </button>
  );
};

export default BookmarkCard; 