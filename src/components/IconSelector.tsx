import React from 'react';
import Icon from './ui/Icon';

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onIconSelect }) => {
  const iconOptions = [
    // Default category icons first
    { icon: 'general', label: 'General' },
    { icon: 'personal', label: 'Personal' },
    { icon: 'work', label: 'Work' },
    // Other icons
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

  return (
    <div className="grid grid-cols-5 gap-2">
      {iconOptions.map((option) => (
        <button
          key={option.icon}
          type="button"
          onClick={() => onIconSelect(option.icon)}
          className={`p-2 rounded-lg flex items-center justify-center ${
            selectedIcon === option.icon
              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400 ring-1 ring-primary-400'
              : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
          }`}
          title={option.label}
        >
          <Icon name={option.icon as any} size="sm" />
        </button>
      ))}
    </div>
  );
};

export default IconSelector; 