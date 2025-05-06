import React, { useState } from 'react';
import { Bookmark } from '../types/User';
import { getFaviconUrl } from '../utils/url';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
  category?: string;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, onDelete, onClick, category }) => {
  const [imageError, setImageError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    onClick(bookmark.id);
    window.open(bookmark.url, '_blank');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      onDelete(bookmark.id);
    }
  };

  const getDisplayUrl = () => {
    try {
      const url = new URL(bookmark.url);
      return url.hostname;
    } catch (e) {
      return bookmark.url;
    }
  };

  const formatDate = (timestamp: number | any) => {
    if (!timestamp) return '';
    
    const date = typeof timestamp === 'number' 
      ? new Date(timestamp) 
      : timestamp.toDate ? new Date(timestamp.toDate()) : new Date();
    
    return date.toLocaleDateString();
  };

  return (
    <div 
      className="relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg bg-gray-800 hover:bg-gray-750 shadow cursor-pointer group"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center p-4 border-b border-gray-700">
        <div className="w-10 h-10 mr-3 flex-shrink-0 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center border border-gray-600">
          <img 
            src={imageError ? getFaviconUrl(bookmark.url) : (bookmark.favicon || getFaviconUrl(bookmark.url))}
            alt=""
            className="max-w-full max-h-full"
            onError={() => setImageError(true)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-purple-400 transition-colors duration-200">
            {bookmark.title}
          </h3>
          <div className="flex items-center">
            <p className="text-sm text-gray-400 truncate">
              {getDisplayUrl()}
            </p>
            {category && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300 border border-gray-600">
                {category}
              </span>
            )}
          </div>
        </div>
        <div className="ml-2 text-xs text-gray-400 flex items-center">
          <span className="mr-1">{bookmark.clickCount || 0}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      </div>
      
      <div className="p-4">
        {bookmark.notes && (
          <p className="text-sm text-gray-300 mb-3 line-clamp-2">
            {bookmark.notes}
          </p>
        )}
        
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {bookmark.tags.slice(0, 3).map(tag => (
              <span 
                key={tag} 
                className="px-2 py-1 text-xs rounded-full bg-purple-900 text-purple-200 border border-purple-700"
              >
                {tag}
              </span>
            ))}
            {bookmark.tags.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300 border border-gray-600">
                +{bookmark.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="mt-3 text-xs text-gray-500">
          Added {formatDate(bookmark.createdAt)}
        </div>
      </div>
      
      <button
        onClick={handleDelete}
        className={`absolute top-2 right-2 p-1.5 rounded-full bg-gray-700 text-gray-400 hover:text-red-400 hover:bg-gray-600 shadow transition-opacity duration-200 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Delete bookmark"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default BookmarkCard; 