import React, { useState } from 'react';
import Icon from '../ui/Icon';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';
import { Category } from '../../types/User';

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
    tags: true
  });
  
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [isEditingCollection, setIsEditingCollection] = useState<boolean>(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState<string>('bookmark');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

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

  const iconOptions: Array<{ icon: string, label: string }> = [
    { icon: 'bookmark', label: 'Bookmark' },
    { icon: 'code', label: 'Code' },
    { icon: 'video', label: 'Video' },
    { icon: 'star', label: 'Star' },
    { icon: 'tag', label: 'Tag' },
  ];

  return (
    <aside 
      className={`
        ${isCollapsed ? 'hidden' : 'w-72'} 
        h-full fixed left-0 top-20 bottom-0 bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700 
        transition-all duration-300 ease-in-out
        z-20 flex flex-col
        shadow-md
      `}
    >
      {/* Main Navigation with Scrolling */}
      <div className="h-full overflow-y-auto custom-scrollbar">
        <nav className={`px-4 py-5 ${isCollapsed ? 'px-2' : 'px-6'}`}>
          {/* Primary Navigation */}
          <div className="space-y-1.5">
            <NavItem 
              icon="home" 
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
                  className="p-1.5 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                  title="Add Collection"
                >
                  <Icon name="plus" size="sm" />
                </button>
              )}
            </div>
            
            {expandedSections.collections && !isCollapsed && (
              <div className="mt-3 space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {(isAddingCollection || isEditingCollection) && (
                  <div className="p-3 rounded-md bg-white dark:bg-gray-700 space-y-3 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <input
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="Collection name"
                      className="w-full py-2 px-3 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-white"
                      autoFocus
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {iconOptions.map((option) => (
                        <button
                          key={option.icon}
                          type="button"
                          onClick={() => setCategoryIcon(option.icon)}
                          className={`p-2 rounded-md flex items-center justify-center ${
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
                        className="px-3 py-1.5 rounded text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveCollection}
                        disabled={!newCollectionName.trim()}
                        className={`px-3 py-1.5 rounded text-sm ${
                          newCollectionName.trim() 
                            ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isEditingCollection ? 'Update' : 'Add Collection'}
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
                          icon={category.icon as any || undefined}
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
                  className="p-1.5 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                  title="Manage Tags"
                >
                  <Icon name="tag" size="sm" />
                </button>
              )}
            </div>
            
            {expandedSections.tags && !isCollapsed && (
              <div className="mt-3 space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoadingTags ? (
                  <div className="px-2 py-3">
                    <div className="animate-pulse flex flex-wrap gap-2">
                      <div className="h-8 w-16 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="h-8 w-20 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="h-8 w-14 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="h-8 w-18 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                  </div>
                ) : tagNames.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center rounded-md bg-gray-50 dark:bg-gray-700/50">
                    No tags yet
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 px-2 py-1">
                    {tagNames.map((tagName, tagIndex) => (
                      <TagPill
                        key={tagIndex}
                        label={tagName}
                        isSelected={selectedTags.includes(tagName)}
                        onClick={() => handleTagClick(tagName)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
      
      {/* Bottom Utilities */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-inner">
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
    <div
      className={`
        flex items-center py-2.5 px-3 rounded-md cursor-pointer 
        ${isActive 
          ? 'bg-primary-500 text-white shadow-sm' 
          : 'text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:shadow-sm'
        }
        ${indented ? 'ml-2' : ''}
        ${className}
        transition-all duration-200
      `}
      onClick={onClick}
    >
      {icon && (
        <div className="flex-shrink-0 w-5 h-5 mr-3">
          <Icon name={icon as any} size="sm" />
        </div>
      )}
      {!isCollapsed && (
        <span className="flex-grow truncate font-medium">{label}</span>
      )}
    </div>
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
        py-1.5 px-3 rounded-full text-sm font-medium
        transition-all duration-200
        ${isSelected 
          ? 'bg-primary-500 text-white'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }
      `}
    >
      {label}
    </button>
  );
};

export default Sidebar; 