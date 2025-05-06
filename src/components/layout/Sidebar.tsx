import React, { useState } from 'react';
import Icon from '../ui/Icon';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';

interface SidebarProps {
  userId: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  selectedTags: string[];
  onTagSelect: (tagIds: string[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  userId,
  isCollapsed,
  onToggleCollapse,
  selectedCategory,
  onCategoryChange,
  selectedTags,
  onTagSelect,
}) => {
  const { categories, isLoading: isLoadingCategories } = useCategories(userId);
  const { tagNames, isLoading: isLoadingTags } = useTags(userId);
  
  const [expandedSections, setExpandedSections] = useState({
    collections: true,
    tags: true
  });
  
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const toggleSection = (section: 'collections' | 'tags') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagSelect(selectedTags.filter(t => t !== tag));
    } else {
      onTagSelect([...selectedTags, tag]);
    }
  };
  
  const handleAddCollection = () => {
    setIsAddingCollection(true);
  };
  
  const handleSaveCollection = () => {
    // Here you would call a function to save the new collection
    console.log('Save new collection:', newCollectionName);
    setIsAddingCollection(false);
    setNewCollectionName('');
  };
  
  const handleCancelAddCollection = () => {
    setIsAddingCollection(false);
    setNewCollectionName('');
  };

  return (
    <aside 
      className={`
        ${isCollapsed ? 'hidden' : 'w-72'} 
        h-full fixed left-0 top-20 bottom-0 bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700 
        transition-all duration-300 ease-in-out
        overflow-hidden z-20
        flex flex-col
      `}
    >
      {/* Main Navigation */}
      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
        <nav className={`px-4 py-5 ${isCollapsed ? 'px-2' : ''}`}>
          {/* Primary Navigation */}
          <div className="space-y-1.5">
            <NavItem 
              icon="home" 
              label="All Bookmarks" 
              isActive={!selectedCategory && selectedTags.length === 0}
              isCollapsed={isCollapsed}
              onClick={() => {
                onCategoryChange('');
                onTagSelect([]);
              }}
            />
            
            <NavItem 
              icon="clock" 
              label="Recently Added" 
              isActive={false}
              isCollapsed={isCollapsed}
              onClick={() => {}}
            />
            
            <NavItem 
              icon="star" 
              label="Favorites" 
              isActive={false}
              isCollapsed={isCollapsed}
              onClick={() => {}}
            />
          </div>
          
          {/* Collections Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <SectionHeader 
                title="Collections"
                isCollapsed={isCollapsed}
                isExpanded={expandedSections.collections}
                onToggle={() => toggleSection('collections')}
              />
              
              {!isCollapsed && !isAddingCollection && (
                <button
                  onClick={handleAddCollection}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Add Collection"
                >
                  <Icon name="plus" size="sm" />
                </button>
              )}
            </div>
            
            {expandedSections.collections && !isCollapsed && (
              <div className="mt-2 space-y-1.5">
                {isAddingCollection && (
                  <div className="px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 flex items-center space-x-2">
                    <input
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="Collection name"
                      className="flex-1 py-1.5 px-3 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveCollection}
                      disabled={!newCollectionName.trim()}
                      className={`p-1.5 rounded-full ${
                        newCollectionName.trim() 
                          ? 'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30' 
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                      title="Save"
                    >
                      <Icon name="bookmark" size="sm" />
                    </button>
                    <button
                      onClick={handleCancelAddCollection}
                      className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Cancel"
                    >
                      <Icon name="close" size="sm" />
                    </button>
                  </div>
                )}
              
                {isLoadingCategories ? (
                  <div className="px-2 py-6">
                    <div className="animate-pulse space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                        <div className="h-4 w-32 rounded bg-gray-300 dark:bg-gray-600"></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                        <div className="h-4 w-28 rounded bg-gray-300 dark:bg-gray-600"></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                        <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-600"></div>
                      </div>
                    </div>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400 text-center rounded-md bg-gray-50 dark:bg-gray-700/50">
                    No collections yet
                  </div>
                ) : (
                  categories.map(category => (
                    <NavItem 
                      key={category.id}
                      icon={category.icon as any || undefined}
                      label={category.name}
                      isActive={selectedCategory === category.id}
                      isCollapsed={isCollapsed}
                      indented
                      onClick={() => onCategoryChange(category.id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
          
          {/* Tags Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <SectionHeader 
                title="Tags"
                isCollapsed={isCollapsed}
                isExpanded={expandedSections.tags}
                onToggle={() => toggleSection('tags')}
              />
              
              {!isCollapsed && (
                <button
                  onClick={() => {}}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Manage Tags"
                >
                  <Icon name="tag" size="sm" />
                </button>
              )}
            </div>
            
            {expandedSections.tags && !isCollapsed && (
              <div className="mt-2 flex flex-wrap gap-2 px-2">
                {isLoadingTags ? (
                  <div className="w-full py-4">
                    <div className="animate-pulse flex flex-wrap gap-2">
                      <div className="h-7 w-16 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="h-7 w-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="h-7 w-20 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="h-7 w-14 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="h-7 w-18 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                  </div>
                ) : tagNames.length === 0 ? (
                  <div className="w-full px-3 py-3 text-sm text-gray-500 dark:text-gray-400 text-center rounded-md bg-gray-50 dark:bg-gray-700/50">
                    No tags yet
                  </div>
                ) : (
                  tagNames.map(tag => (
                    <TagPill
                      key={tag}
                      label={tag}
                      isSelected={selectedTags.includes(tag)}
                      onClick={() => handleTagClick(tag)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
      
      {/* Bottom Utilities */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-inner">
        <NavItem 
          icon="settings" 
          label="Settings" 
          isActive={false}
          isCollapsed={isCollapsed}
          onClick={() => {}}
        />
        
        <button
          onClick={onToggleCollapse}
          className={`
            mt-4 w-full flex items-center justify-center p-2.5 rounded-md 
            text-gray-600 dark:text-gray-300 
            bg-gray-100 dark:bg-gray-700
            hover:bg-gray-200 dark:hover:bg-gray-600 
            transition-all duration-200
          `}
        >
          <Icon name={isCollapsed ? 'chevron-right' : 'chevron-left'} size={isCollapsed ? 'md' : 'sm'} />
          {!isCollapsed && <span className="ml-2 text-sm font-medium">Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon?: string;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  indented?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  isActive,
  isCollapsed,
  indented = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center px-3 py-2.5 text-sm rounded-md
        ${isActive ? 
          'bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300 font-medium border-l-2 border-primary-500 dark:border-primary-400' : 
          'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-l-2 border-transparent'
        }
        ${indented && !isCollapsed ? 'pl-5' : ''}
        transition-all duration-200
      `}
    >
      {icon && <Icon name={icon as any} size="md" className={`flex-shrink-0 ${isActive ? 'text-primary-500 dark:text-primary-400' : ''}`} />}
      {!isCollapsed && (
        <span className={`${icon ? 'ml-3' : ''} truncate flex-1 text-left`}>{label}</span>
      )}
    </button>
  );
};

interface SectionHeaderProps {
  title: string;
  isCollapsed: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  isCollapsed,
  isExpanded,
  onToggle,
}) => {
  return (
    <div className="flex items-center">
      {!isCollapsed && (
        <h3 className="px-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {!isCollapsed && (
        <button
          onClick={onToggle}
          className="ml-1.5 p-1 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size="sm" />
        </button>
      )}
    </div>
  );
};

interface TagPillProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const TagPill: React.FC<TagPillProps> = ({
  label,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium
        ${isSelected ? 
          'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 ring-1 ring-primary-300 dark:ring-primary-700' : 
          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }
        transition-all duration-200 hover:scale-105
      `}
    >
      <span>{label}</span>
    </button>
  );
};

export default Sidebar; 