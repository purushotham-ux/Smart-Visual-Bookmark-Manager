import React, { useState } from 'react';
import Icon from '../ui/Icon';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';
import { Category } from '../../types/User';
import ImportExport from '../ImportExport';

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
  const { categories, isLoading: isLoadingCategories, addCategory, updateCategory, deleteCategory } = useCategories(userId);
  const { tagNames, isLoading: isLoadingTags } = useTags(userId);
  
  const [expandedSections, setExpandedSections] = useState({
    collections: true,
  });
  
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [isEditingCollection, setIsEditingCollection] = useState<boolean>(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState<string>('bookmark');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showImportExport, setShowImportExport] = useState<boolean>(false);

  const toggleSection = (section: 'collections') => {
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
    setIsEditingCollection(false);
    setEditingCategoryId(null);
    setNewCollectionName('');
    setCategoryIcon('bookmark');
  };
  
  const handleEditCollection = (category: Category) => {
    setIsEditingCollection(true);
    setIsAddingCollection(false);
    setEditingCategoryId(category.id);
    setNewCollectionName(category.name);
    setCategoryIcon(category.icon || 'bookmark');
  };
  
  const handleDeleteCollection = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      setShowDeleteConfirm(null);
      
      // If the deleted category is currently selected, switch to 'all'
      if (selectedCategory === categoryId) {
        onCategoryChange('all');
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      // Handle error (show notification, etc.)
    }
  };
  
  const handleSaveCollection = async () => {
    if (newCollectionName.trim()) {
      try {
        if (isEditingCollection && editingCategoryId) {
          // Update existing category
          await updateCategory(editingCategoryId, {
            name: newCollectionName.trim(),
            icon: categoryIcon,
          });
        } else {
          // Add new category
          const newCategoryId = await addCategory({
            name: newCollectionName.trim(),
            icon: categoryIcon,
          });
          
          // Select the new category
          if (newCategoryId) {
            onCategoryChange(newCategoryId);
          }
        }
        
        // Reset the form
        setNewCollectionName('');
        setCategoryIcon('bookmark');
        setIsEditingCollection(false);
        setEditingCategoryId(null);
      } catch (error) {
        console.error('Error saving collection:', error);
        // Handle error (show notification, etc.)
      }
    }
    setIsAddingCollection(false);
  };
  
  const handleCancelAddCollection = () => {
    setIsAddingCollection(false);
    setIsEditingCollection(false);
    setEditingCategoryId(null);
    setNewCollectionName('');
  };

  const handleImportComplete = () => {
    // Refresh the categories or bookmarks as needed
    setShowImportExport(false);
  };

  const iconOptions: Array<{ icon: string, label: string }> = [
    { icon: 'bookmark', label: 'Bookmark' },
    { icon: 'code', label: 'Code' },
    { icon: 'video', label: 'Video' },
    { icon: 'star', label: 'Star' },
    { icon: 'tag', label: 'Tag' },
    { icon: 'hosting', label: 'Hosting' },
    { icon: 'entertainment', label: 'Entertainment' },
    { icon: 'music', label: 'Music' },
    { icon: 'chatbots', label: 'Chatbots' },
    { icon: 'humanizer', label: 'Humanizer' },
    { icon: 'anime', label: 'Anime' },
    { icon: 'designs', label: 'Designs' },
    { icon: 'shopping', label: 'Shopping' },
    { icon: 'learning', label: 'Learning' },
    { icon: 'finance', label: 'Finance' },
  ];

  // Function to automatically select a suitable icon for a category name
  const getSuitableIconForCategory = (category: Category) => {
    // If the category already has an icon, use it
    if (category.icon) return category.icon as any;
    
    // Special keywords mapping to specific icons
    const categoryNameLower = category.name.toLowerCase();
    
    // Map common category names to appropriate icons
    if (categoryNameLower.includes('general')) return 'general';
    if (categoryNameLower.includes('personal')) return 'personal';
    if (categoryNameLower.includes('work')) return 'work';
    if (categoryNameLower.includes('dev') || categoryNameLower.includes('code')) return 'code';
    if (categoryNameLower.includes('design')) return 'designs';
    if (categoryNameLower.includes('video') || categoryNameLower.includes('watch')) return 'video';
    if (categoryNameLower.includes('music') || categoryNameLower.includes('audio')) return 'music';
    if (categoryNameLower.includes('shop') || categoryNameLower.includes('store')) return 'shopping';
    if (categoryNameLower.includes('learn') || categoryNameLower.includes('course')) return 'learning';
    if (categoryNameLower.includes('chat') || categoryNameLower.includes('bot')) return 'chatbots';
    if (categoryNameLower.includes('finance') || categoryNameLower.includes('money')) return 'finance';
    if (categoryNameLower.includes('host') || categoryNameLower.includes('server')) return 'hosting';
    if (categoryNameLower.includes('anime') || categoryNameLower.includes('manga')) return 'anime';
    
    // Default to bookmark icon if no matches
    return 'bookmark';
  };

  return (
    <aside 
      className={`
        ${isCollapsed ? 'hidden' : 'w-72'} 
        h-full fixed left-0 top-20 bottom-0 
        bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 
        border-r border-gray-200 dark:border-gray-700 
        transition-all duration-300 ease-in-out
        z-20 flex flex-col
        shadow-md backdrop-blur-sm
      `}
    >
      {/* Main Navigation with Scrolling */}
      <div className="h-full overflow-y-auto custom-scrollbar">
        <nav className={`px-4 py-5 ${isCollapsed ? 'px-2' : 'px-6'}`}>
          {/* Primary Navigation */}
          <div className="space-y-1.5">
            <NavItem 
              icon="general" 
              label="All Bookmarks" 
              isActive={selectedCategory === 'all' && selectedTags.length === 0}
              isCollapsed={isCollapsed}
              onClick={() => {
                onCategoryChange('all');
                onTagSelect([]);
              }}
            />
            
            <NavItem 
              icon="clock" 
              label="Recently Added" 
              isActive={selectedCategory === 'recent'}
              isCollapsed={isCollapsed}
              onClick={() => {
                onCategoryChange('recent');
                onTagSelect([]);
              }}
            />
            
            <NavItem 
              icon="star" 
              label="Favorites" 
              isActive={selectedCategory === 'favorites'}
              isCollapsed={isCollapsed}
              onClick={() => {
                onCategoryChange('favorites');
                onTagSelect([]);
              }}
            />
          </div>
          
          {/* Import/Export Buttons - Moved to here for better visibility */}
          {!isCollapsed && (
            <div className="flex space-x-2 mt-4 mb-2">
              <button
                onClick={() => setShowImportExport(true)}
                className="flex-1 flex items-center justify-center p-2 rounded-md 
                  text-gray-700 dark:text-gray-300 
                  bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                  hover:bg-gray-200 dark:hover:bg-gray-600 
                  transition-all duration-200"
                title="Import bookmarks"
              >
                <Icon name="import" size="sm" className="mr-2 text-primary-500" />
                <span className="text-sm font-medium">Import</span>
              </button>
              
              <button
                onClick={() => setShowImportExport(true)}
                className="flex-1 flex items-center justify-center p-2 rounded-md 
                  text-gray-700 dark:text-gray-300 
                  bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                  hover:bg-gray-200 dark:hover:bg-gray-600 
                  transition-all duration-200"
                title="Export bookmarks"
              >
                <Icon name="export" size="sm" className="mr-2 text-primary-500" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          )}

          {/* ImportExport Modal */}
          {showImportExport && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full animate-fade-in-up relative p-6">
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Import/Export Bookmarks</h2>
                  <button 
                    onClick={() => setShowImportExport(false)}
                    className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Icon name="close" size="sm" />
                  </button>
                </div>
                <ImportExport userId={userId} onImportComplete={handleImportComplete} />
              </div>
            </div>
          )}
          
          {/* Collections Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <SectionHeader 
                title="Collections"
                isCollapsed={isCollapsed}
                isExpanded={expandedSections.collections}
                onToggle={() => toggleSection('collections')}
              />
              
              {!isCollapsed && !isAddingCollection && !isEditingCollection && (
                <button
                  onClick={handleAddCollection}
                  className="p-1.5 rounded-full text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                  title="Add Collection"
                >
                  <Icon name="plus" size="sm" />
                </button>
              )}
            </div>
            
            {expandedSections.collections && !isCollapsed && (
              <div className="mt-3 space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {(isAddingCollection || isEditingCollection) && (
                  <div className="p-3 rounded-lg bg-white dark:bg-gray-700 space-y-3 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <input
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="Collection name"
                      className="w-full py-2 px-3 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-white"
                      autoFocus
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {iconOptions.map((option) => (
                        <button
                          key={option.icon}
                          type="button"
                          onClick={() => setCategoryIcon(option.icon)}
                          className={`p-2 rounded-lg flex items-center justify-center ${
                            categoryIcon === option.icon
                              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400 ring-1 ring-primary-400'
                              : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                          title={option.label}
                        >
                          <Icon name={option.icon as any} size="sm" />
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={handleCancelAddCollection}
                        className="px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveCollection}
                        disabled={!newCollectionName.trim()}
                        className={`px-3 py-1.5 rounded-lg text-sm ${
                          newCollectionName.trim() 
                            ? 'bg-gradient-primary text-white hover:shadow-blue-glow'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isEditingCollection ? 'Update' : 'Create'}
                      </button>
                    </div>
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
                    <div key={category.id} className="relative group">
                      {/* Delete Confirmation Dialog */}
                      {showDeleteConfirm === category.id && (
                        <div className="absolute right-0 top-0 mt-8 z-10 bg-white dark:bg-gray-700 rounded-md shadow-lg p-3 w-52 text-sm border border-gray-200 dark:border-gray-600">
                          <p className="text-gray-700 dark:text-gray-200 mb-2">Delete this collection?</p>
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-2 py-1 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleDeleteCollection(category.id)}
                              className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <NavItem 
                          icon={
                            category.name.toLowerCase() === 'general' ? 'general' :
                            category.name.toLowerCase() === 'work' ? 'work' :
                            category.name.toLowerCase() === 'personal' ? 'personal' :
                            getSuitableIconForCategory(category)
                          }
                          label={category.name}
                          isActive={selectedCategory === category.id}
                          isCollapsed={isCollapsed}
                          indented
                          onClick={() => onCategoryChange(category.id)}
                          className="flex-grow"
                        />
                        
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCollection(category);
                            }}
                            className="ml-1 p-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Edit collection"
                          >
                            <Icon name="edit" size="sm" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(category.id);
                            }}
                            className="ml-1 p-1 text-gray-600 dark:text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Delete collection"
                          >
                            <Icon name="close" size="sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
      
      {/* Bottom Utilities */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-inner space-y-3">
        {/* Import/Export Buttons moved to top section */}
        
        <button
          onClick={onToggleCollapse}
          className={`
            w-full flex items-center justify-center p-2.5 rounded-md 
            text-gray-700 dark:text-gray-300 
            bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600
            hover:bg-gray-200 dark:hover:bg-gray-600 
            transition-all duration-200
            ${!isCollapsed ? 'hover:shadow-sm' : ''}
          `}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon name={isCollapsed ? 'chevron-right' : 'chevron-left'} size={isCollapsed ? 'md' : 'sm'} className="text-primary-500" />
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
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  isActive,
  isCollapsed,
  indented = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center space-x-3 py-2.5 px-3
        transition-all duration-200
        rounded-lg
        ${isActive 
          ? 'bg-gradient-primary text-white shadow-sm hover:shadow-blue-glow' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}
        ${indented ? 'pl-7' : ''}
        ${className}
        ${isCollapsed ? 'justify-center' : ''}
      `}
    >
      {icon && <Icon name={icon as any} size={isCollapsed ? 'lg' : 'sm'} className={isActive ? 'text-white' : ''} />}
      {!isCollapsed && <span className="text-sm font-medium truncate">{label}</span>}
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
    <div className="flex items-center cursor-pointer" onClick={onToggle}>
      {!isCollapsed && (
        <>
          <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </h3>
          <button
            className="ml-1.5 text-gray-600 dark:text-gray-400 focus:outline-none"
            title={isExpanded ? `Collapse ${title}` : `Expand ${title}`}
          >
            <Icon
              name={isExpanded ? 'chevron-down' : 'chevron-right'}
              size="sm"
              className="transform transition-transform"
            />
          </button>
        </>
      )}
    </div>
  );
};

export default Sidebar; 