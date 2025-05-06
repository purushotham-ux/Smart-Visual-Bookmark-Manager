import React from 'react';
import { Bookmark } from '../types/User';
import { getFaviconUrl } from '../utils/url';

interface RecommendedBookmarksProps {
  bookmarks: Bookmark[];
  onBookmarkClick: (id: string) => void;
}

const RecommendedBookmarks: React.FC<RecommendedBookmarksProps> = ({ 
  bookmarks, 
  onBookmarkClick 
}) => {
  if (bookmarks.length === 0) return null;

  return (
    <div className="mb-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-5">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        Frequently Visited
      </h2>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {bookmarks.map(bookmark => (
          <div
            key={bookmark.id}
            onClick={() => {
              onBookmarkClick(bookmark.id);
              window.open(bookmark.url, '_blank');
            }}
            className="flex-shrink-0 flex flex-col items-center cursor-pointer p-3 hover:bg-gray-700 rounded-lg transition-colors duration-200 min-w-[80px]"
          >
            <div className="w-12 h-12 mb-2 flex items-center justify-center bg-gray-700 rounded-full overflow-hidden border border-gray-600">
              <img 
                src={bookmark.favicon || getFaviconUrl(bookmark.url)} 
                alt=""
                className="w-8 h-8"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getFaviconUrl(bookmark.url);
                }}
              />
            </div>
            <span className="text-sm text-white text-center line-clamp-1 w-20">
              {bookmark.title}
            </span>
            <span className="text-xs text-purple-400 mt-1 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {bookmark.clickCount || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedBookmarks; 