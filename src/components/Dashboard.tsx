import React, { useState } from 'react';
import { User, Bookmark } from '../types/User';
import BookmarkCard from './BookmarkCard';
import AddBookmarkModal from './AddBookmarkModal';
import CategoryFilter from './CategoryFilter';
import TagCloud from './TagCloud';
import RecommendedBookmarks from './RecommendedBookmarks';
import { useAuth } from '../contexts/AuthContext';
import { useBookmarks } from '../hooks/useBookmarks';
import { useCategories } from '../hooks/useCategories';
import { useTags } from '../hooks/useTags';
import { useTheme } from '../hooks/useTheme';
import ImportExport from './ImportExport';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { logOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  
  // Custom hooks for data management
  const { 
    filteredBookmarks, 
    isLoading: isLoadingBookmarks,
    searchQuery, 
    setSearchQuery,
    selectedCategory, 
    setSelectedCategory,
    selectedTags, 
    setSelectedTags,
    addBookmark,
    deleteBookmark,
    handleBookmarkClick
  } = useBookmarks(user.uid);
  
  const { 
    categories, 
    isLoading: isLoadingCategories
  } = useCategories(user.uid);
  
  const { 
    tagNames, 
    isLoading: isLoadingTags
  } = useTags(user.uid);
  
  const isLoading = isLoadingBookmarks || isLoadingCategories || isLoadingTags;

  const handleAddBookmark = async (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt' | 'position' | 'clickCount'>) => {
    try {
      console.log('Dashboard: Handling add bookmark request:', bookmark);
      
      // Ensure URL is properly formatted
      if (!bookmark.url) {
        throw new Error('URL is required');
      }
      
      // Ensure we have a valid category
      let categoryToUse: string = bookmark.category;
      
      // If no category is selected or the category doesn't exist, use the first available category
      if (!categoryToUse || !categories.some(cat => cat.id === categoryToUse)) {
        if (categories.length > 0) {
          categoryToUse = categories[0].id;
          console.log('Dashboard: No valid category provided, using first category:', categoryToUse);
        } else {
          categoryToUse = ''; // Fallback if no categories exist
          console.log('Dashboard: No categories exist, using empty category');
        }
      }
      
      // Create a new bookmark object with the updated category
      const bookmarkToAdd = {
        title: bookmark.title,
        url: bookmark.url,
        category: categoryToUse,
        tags: bookmark.tags,
        notes: bookmark.notes,
        favicon: bookmark.favicon
      };
      
      console.log('Dashboard: Final bookmark data to add:', bookmarkToAdd);
      await addBookmark(bookmarkToAdd);
      
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Dashboard: Error adding bookmark:', error);
      let errorMessage = 'Failed to add bookmark. Please try again.';
      
      // Extract more specific error message if available
      if (error instanceof Error) {
        errorMessage = `Failed to add bookmark: ${error.message}`;
      }
      
      // Show error to user
      alert(errorMessage);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Modern Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {showSidebar ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <div className="flex-shrink-0 flex items-center ml-4">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  Bookmark Hub
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Bookmark</span>
              </button>
              
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              
              <div className="relative group">
                <button className="flex items-center gap-2 max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500">
                  <img
                    className="h-8 w-8 rounded-full border-2 border-purple-500"
                    src={user.photoURL || 'https://via.placeholder.com/40'}
                    alt={user.displayName || 'User'}
                  />
                  <span className="text-sm font-medium text-white hidden sm:inline-block">
                    {user.displayName}
                  </span>
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 hidden group-hover:block">
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <aside className={`${showSidebar ? 'block' : 'hidden'} w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto fixed sm:static h-[calc(100vh-4rem)] z-40`}>
          <div className="p-4">
            {/* Search bar */}
            <div className="mb-6">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                />
                {searchQuery && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-gray-400 hover:text-white focus:outline-none"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Categories
            </h2>
            <div className="mb-6">
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
            
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Tags
            </h2>
            <div className="mb-6">
              <TagCloud 
                tags={tagNames}
                selectedTags={selectedTags}
                onTagSelect={setSelectedTags}
              />
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Import & Export
              </h2>
              <ImportExport userId={user.uid} />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className={`flex-1 overflow-y-auto bg-gray-900 p-6 ${showSidebar ? 'sm:ml-64' : ''}`}>
          {/* Recommended bookmarks section */}
          <RecommendedBookmarks 
            bookmarks={filteredBookmarks.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0)).slice(0, 5)}
            onBookmarkClick={handleBookmarkClick}
          />
          
          {/* Bookmarks grid */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              {selectedCategory === 'all' ? (
                <span className="flex items-center">
                  <svg className="w-6 h-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  All Bookmarks
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-6 h-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {categories.find(c => c.id === selectedCategory)?.name || 'Bookmarks'}
                </span>
              )}
              {selectedTags.length > 0 && (
                <span className="ml-2 flex items-center text-sm font-normal text-gray-400">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {selectedTags.join(', ')}
                </span>
              )}
              {searchQuery && (
                <span className="ml-2 text-gray-400 text-sm">
                  • Search: "{searchQuery}"
                </span>
              )}
            </h2>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-10">
                <div className="loader">
                  <div className="h-12 w-12 rounded-full border-t-4 border-purple-500 border-r-4 border-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-400">Loading your bookmarks...</p>
              </div>
            ) : filteredBookmarks.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">No bookmarks found</h3>
                <p className="mt-2 text-gray-400 max-w-md mx-auto">
                  {searchQuery || selectedTags.length > 0 || selectedCategory !== 'all' 
                    ? 'Try adjusting your filters or search query.' 
                    : 'Add your first bookmark to get started!'}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Bookmark
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBookmarks.map(bookmark => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onDelete={deleteBookmark}
                    onClick={handleBookmarkClick}
                    category={categories.find(c => c.id === bookmark.category)?.name || 'Uncategorized'}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add bookmark modal */}
      {isAddModalOpen && (
        <AddBookmarkModal
          categories={categories}
          tags={tagNames}
          onAdd={handleAddBookmark}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard; 