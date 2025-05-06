import React, { useMemo } from 'react';

interface TagCloudProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tags: string[]) => void;
}

const TagCloud: React.FC<TagCloudProps> = ({ tags, selectedTags, onTagSelect }) => {
  const handleTagClick = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagSelect(selectedTags.filter(t => t !== tagName));
    } else {
      onTagSelect([...selectedTags, tagName]);
    }
  };

  // Sort tags alphabetically
  const sortedTags = useMemo(() => [...tags].sort(), [tags]);
  
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {sortedTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-2 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                selectedTags.includes(tag)
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
          
          {selectedTags.length > 0 && (
            <button
              onClick={() => onTagSelect([])}
              className="px-2 py-1 rounded-md text-sm font-medium bg-red-700 text-white hover:bg-red-800 transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TagCloud; 