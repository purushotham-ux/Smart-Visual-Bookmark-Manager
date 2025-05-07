import React, { useState, useRef, useEffect } from 'react';
import Icon, { IconName } from '../ui/Icon';
import { User } from '../../types/User';
import { useTheme } from '../../hooks/useTheme.js';
import { useAuth } from '../../contexts/AuthContext';
import ProfileSettingsModal from '../ProfileSettingsModal';

type ViewType = 'grid' | 'list';

interface TopBarProps {
  user: User;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onAddBookmark: () => void;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const TopBar: React.FC<TopBarProps> = ({
  user,
  isMenuOpen,
  onMenuToggle,
  activeView,
  onViewChange,
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { logOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = searchRef.current?.querySelector('input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 shadow-md">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left Section - Logo and Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-200"
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <Icon name={isMenuOpen ? 'close' : 'menu'} size="md" />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-xl font-semibold text-primary-600 dark:text-primary-400">
              VisualMarks
            </h1>
          </div>
        </div>

        {/* Middle Section - Search */}
        <div 
          ref={searchRef}
          className={`
            w-full max-w-xl mx-6 hidden md:block 
            ${searchFocused ? 'ring-2 ring-primary-500 dark:ring-primary-400 rounded-md' : ''}
          `}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Icon name="search" className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search bookmarks (Ctrl+K)..."
              className="block w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors duration-200"
            />
            {searchQuery && (
              <div className="absolute inset-y-0 right-1 px-2 pr-3.5 flex items-center">
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

        {/* Right Section - View Controls and User */}
        <div className="flex items-center justify-end space-x-4">
          {/* View Controls */}
          <div className="hidden sm:flex bg-gray-100 dark:bg-gray-700 rounded-md">
            <ViewButton
              view="grid"
              label="Grid"
              activeView={activeView}
              onChange={onViewChange}
            />
            <ViewButton
              view="list"
              label="List"
              activeView={activeView}
              onChange={onViewChange}
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-200"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <Icon name={isDarkMode ? "sun" : "moon"} size="md" />
          </button>

          {/* User Menu */}
          <div ref={userMenuRef} className="relative py-5">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
              aria-expanded={isUserMenuOpen}
            >
              <span className="hidden md:block mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.displayName || 'Profile'}
              </span>
              <img
                src={user.photoURL || 'https://via.placeholder.com/40'}
                alt={user.displayName || 'User'}
                className="h-10 w-10 rounded-full object-cover border-2 border-primary-500 transition-transform duration-200 hover:scale-110"
              />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-full rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none px-2.5 divide-y divide-gray-200 dark:divide-gray-700">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
                
                <div className="py-1">
                  <MenuItem
                    label="Profile Settings"
                    icon="settings"
                    onClick={() => setIsProfileModalOpen(true)}
                  />
                </div>
                
                <div className="py-1">
                  <MenuItem
                    label="Sign out"
                    icon="logout"
                    onClick={handleSignOut}
                    danger
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isProfileModalOpen && (
        <ProfileSettingsModal user={user} onClose={() => setIsProfileModalOpen(false)} />
      )}
    </header>
  );
};

interface ViewButtonProps {
  view: ViewType;
  label: string;
  activeView: ViewType;
  onChange: (view: ViewType) => void;
}

const ViewButton: React.FC<ViewButtonProps> = ({ view, label, activeView, onChange }) => {
  const isActive = view === activeView;
  
  const viewIcons: Record<ViewType, IconName> = {
    grid: 'grid',
    list: 'list'
  };

  return (
    <button
      onClick={() => onChange(view)}
      className={`flex items-center px-3 py-2 rounded-md transition-all duration-200 ${
        isActive
          ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-primary-400'
          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
      }`}
      aria-label={`${label} View`}
      title={`${label} View`}
    >
      <Icon name={viewIcons[view]} size="sm" className="mr-1.5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

interface MenuItemProps {
  label: string;
  icon: string;
  onClick: () => void;
  danger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, icon, onClick, danger = false }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center w-full px-4 py-2.5 text-sm
        ${danger 
          ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
        }
        transition-colors duration-200
      `}
    >
      <Icon name={icon as any} size="sm" className="mr-2.5 flex-shrink-0" />
      {label}
    </button>
  );
};

export default TopBar; 