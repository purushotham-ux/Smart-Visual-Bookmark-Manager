import React, { useState, useEffect } from 'react';
import { User, Bookmark } from '../types/User';
import BookmarkCard from './BookmarkCard';
import AddBookmarkModal from './AddBookmarkModal';
import Sidebar from './layout/Sidebar';
import TopBar from './layout/TopBar';
import { useAuth } from '../contexts/AuthContext';
import { useBookmarks } from '../hooks/useBookmarks';
import { useCategories } from '../hooks/useCategories';
// @ts-ignore - Import JavaScript file
import { useTheme } from '../hooks/useTheme.js';
import Icon from './ui/Icon';
import Button from './ui/Button';
import { getSampleBookmarks, generateSampleBookmark } from '../services/sampleData';
import { useNotification } from '../contexts/NotificationContext';

interface DashboardProps {
  user: User;
}

// View Types
type ViewType = 'grid' | 'list';

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  console.log(`Dashboard mounted for user: ${user.uid}`);
  
  // Use notification system
  const { showNotification } = useNotification();
  
  // UI State
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ViewType>('grid');
  const { isDarkMode } = useTheme();
  const [isLoadingSamples, setIsLoadingSamples] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [editBookmark, setEditBookmark] = useState<Bookmark | null>(null);
  
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
    updateBookmark,
    handleBookmarkClick
  } = useBookmarks(user.uid);
  
  // Get categories for display
  const { categories } = useCategories(user.uid);
  
  // Simulate initial page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Ensure userId is valid
  useEffect(() => {
    if (!user.uid) {
      console.error('Dashboard: User ID is missing or invalid');
    } else {
      console.log(`Dashboard: Initialized for user ${user.uid}`);
    }
  }, [user.uid]);

  const handleAddBookmark = async (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt' | 'position' | 'clickCount'>) => {
    try {
      console.log(`Dashboard: Handling add bookmark request for user ${user.uid}:`, bookmark);
      
      // Ensure URL is properly formatted
      if (!bookmark.url) {
        throw new Error('URL is required');
      }
      
      await addBookmark(bookmark);
      console.log('Dashboard: Bookmark added successfully');
      showNotification('success', 'Bookmark added successfully!');
      setIsAddModalOpen(false);
    } catch (error) {
      console.error(`Dashboard: Error adding bookmark for user ${user.uid}:`, error);
      let errorMessage = 'Failed to add bookmark. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = `Failed to add bookmark: ${error.message}`;
      }
      
      showNotification('error', errorMessage);
    }
  };

  // Handle edit for bookmark
  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditBookmark(bookmark);
    setIsAddModalOpen(true);
  };

  // Handle successful bookmark update
  const handleUpdateBookmark = async (bookmarkId: string, updates: Partial<Bookmark>) => {
    try {
      await updateBookmark(bookmarkId, updates);
      showNotification('success', 'Bookmark updated successfully!');
      setEditBookmark(null);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error updating bookmark:', error);
      showNotification('error', 'Failed to update bookmark. Please try again.');
    }
  };

  // Handle bookmark deletion with notification
  const handleDeleteBookmark = async (id: string) => {
    try {
      await deleteBookmark(id);
      showNotification('success', 'Bookmark deleted successfully!');
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      showNotification('error', 'Failed to delete bookmark. Please try again.');
    }
  };

  // Function to add sample data
  const handleAddSampleBookmarks = async () => {
    setIsLoadingSamples(true);
    try {
      const sampleBookmarks = getSampleBookmarks();
      
      // Add each sample bookmark with a slight delay to avoid overwhelming Firebase
      for (const bookmark of sampleBookmarks) {
        await addBookmark(bookmark);
        // Small delay between operations
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      console.log('Added sample bookmarks successfully');
      showNotification('success', 'Sample bookmarks added successfully!');
    } catch (error) {
      console.error('Failed to add sample bookmarks:', error);
      showNotification('error', 'Failed to add sample bookmarks. Please try again.');
    } finally {
      setIsLoadingSamples(false);
    }
  };

  // Grid layout based on active view
  const getGridLayout = () => {
    switch (activeView) {
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
      case 'list':
        return 'flex flex-col gap-4';
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    }
  };

  // Generate skeleton loaders while content is loading
  const renderSkeletons = () => {
  return (
      <div className={getGridLayout()}>
        {Array(8).fill(0).map((_, index) => (
          <div key={`skeleton-${index}`} className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 animate-pulse shadow-md">
            <div className="h-1 w-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-4">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
              <div className="flex mt-4 space-x-2">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render empty state when no bookmarks are available
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="bg-primary-50 dark:bg-primary-900/30 p-6 rounded-full mb-6">
        <Icon name="bookmark" size="xl" className="text-primary-500 dark:text-primary-400" />
      </div>
      <h3 className="text-h2 font-semibold text-gray-900 dark:text-white mb-4">
        Your bookmark collection is empty
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-lg mb-8 text-lg">
        {selectedCategory !== 'all' || selectedTags.length > 0
          ? "No bookmarks match your current filters. Try changing your selection or add a new bookmark."
          : "Start building your visual bookmark collection by adding your favorite websites, tools, and resources."}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button
          variant="secondary"
                onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Icon name="plus" />}
          fullWidth
          size="lg"
          className="transform transition-transform duration-200 hover:scale-105"
        >
          Add Your First Bookmark
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleAddSampleBookmarks}
          leftIcon={<Icon name="bookmark" />}
          fullWidth
          size="lg"
          isLoading={isLoadingSamples}
          className="transform transition-transform duration-200 hover:scale-105"
        >
          Add Sample Bookmarks
        </Button>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700 max-w-lg">
        <h4 className="text-h4 font-medium text-gray-800 dark:text-gray-200 mb-2">Pro Tips:</h4>
        <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
          <li className="flex items-start">
            <Icon name="bookmark" className="text-primary-500 mr-2 mt-1 flex-shrink-0" size="sm" />
            <span>Organize your bookmarks in collections</span>
          </li>
          <li className="flex items-start">
            <Icon name="tag" className="text-primary-500 mr-2 mt-1 flex-shrink-0" size="sm" />
            <span>Add tags to make your bookmarks easier to find</span>
          </li>
          <li className="flex items-start">
            <Icon name="search" className="text-primary-500 mr-2 mt-1 flex-shrink-0" size="sm" />
            <span>Use the search bar to quickly find what you need</span>
          </li>
        </ul>
                </div>
              </div>
  );

  // Initial loading screen
  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-primary-500 dark:bg-primary-600 rounded-full flex items-center justify-center animate-pulse">
              <Icon name="bookmark" size="xl" className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            VisualMarks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your bookmarks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white ${isDarkMode ? 'dark' : ''}`}>
      {/* Top Application Bar */}
      <TopBar
        user={user}
        isMenuOpen={showSidebar}
        onMenuToggle={() => setShowSidebar(!showSidebar)}
        onAddBookmark={() => setIsAddModalOpen(true)}
        activeView={activeView}
        onViewChange={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <Sidebar
          userId={user.uid}
          isCollapsed={!showSidebar}
          onToggleCollapse={() => setShowSidebar(!showSidebar)}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedTags={selectedTags}
          onTagSelect={setSelectedTags}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 ${
            showSidebar ? 'md:ml-72' : 'md:ml-16'
          } pt-20`}
        >
          <div className="p-4 md:p-8">
            {/* Page Header */}
            <div className="mb-6 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-60 backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h1 className="text-h1 font-semibold text-gray-900 dark:text-white">
                    {selectedCategory === 'favorites' 
                      ? 'Favorite Bookmarks'
                      : selectedCategory === 'recent'
                        ? 'Recently Added Bookmarks'
                        : selectedCategory !== 'all' && selectedCategory
                          ? `Collection: ${categories.find(cat => cat.id === selectedCategory)?.name || 'Unknown Collection'}` 
                          : selectedTags.length > 0 
                            ? `Tags: ${selectedTags.join(', ')}` 
                            : 'All Bookmarks'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {filteredBookmarks.length} {filteredBookmarks.length === 1 ? 'bookmark' : 'bookmarks'} {searchQuery ? `matching "${searchQuery}"` : ''}
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setIsAddModalOpen(true)}
                  leftIcon={<Icon name="plus" />}
                  className="hidden md:flex mt-4 md:mt-0 transform transition-transform duration-200 hover:scale-105 bg-gradient-primary hover:shadow-blue-glow"
                >
                  Add Bookmark
                </Button>
              </div>

              {/* Mobile Search - Visible only on small screens */}
              <div className="mt-4 md:hidden">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="search" className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bookmarks..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                />
                {searchQuery && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button 
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      onClick={() => setSearchQuery('')}
                    >
                        <Icon name="close" size="sm" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            </div>
            
            {/* Bookmarks Grid/List */}
            {isLoadingBookmarks ? (
              renderSkeletons()
            ) : filteredBookmarks.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className={`${getGridLayout()} mb-8`}>
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onDelete={handleDeleteBookmark}
                    onClick={handleBookmarkClick}
                    aspectRatio={activeView === 'list' ? 'list' : '16:9'}
                    onEdit={handleEditBookmark}
                    onFavorite={(id, isFavorite) => updateBookmark(id, { isFavorite })}
                    isFeatured={bookmark.isFavorite && selectedCategory !== 'favorites'}
                  />
                ))}
              </div>
            )}
            
            {/* Mobile Add Button - Fixed at the bottom for easy access on mobile */}
            <div className="md:hidden fixed bottom-6 right-6 z-20">
              <Button
                variant="primary"
                onClick={() => setIsAddModalOpen(true)}
                className="rounded-full w-14 h-14 flex items-center justify-center shadow-lg transform transition-transform duration-200 hover:scale-110 active:scale-95 bg-gradient-primary hover:shadow-blue-glow"
                aria-label="Add bookmark"
              >
                <Icon name="plus" size="lg" />
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Add Bookmark Modal */}
      {isAddModalOpen && (
        <AddBookmarkModal
          onClose={() => {
            setIsAddModalOpen(false);
            setEditBookmark(null);
          }}
          onAdd={editBookmark ? 
            (bookmarkData) => handleUpdateBookmark(editBookmark.id, bookmarkData) : 
            handleAddBookmark
          }
          userId={user.uid}
          editBookmark={editBookmark || undefined}
          currentCategory={selectedCategory !== 'all' && 
                           selectedCategory !== 'favorites' && 
                           selectedCategory !== 'recent' ? 
                           selectedCategory : undefined}
        />
      )}
    </div>
  );
};

export default Dashboard; 