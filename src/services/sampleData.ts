import { Timestamp } from 'firebase/firestore';
import { Bookmark } from '../types/User';

// Sample bookmark data for demonstration
export const getSampleBookmarks = (): Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt' | 'position' | 'clickCount'>[] => {
  return [
    {
      title: 'GitHub - Code Hosting Platform',
      url: 'https://github.com',
      category: 'development',
      tags: ['coding', 'git', 'open-source'],
      notes: 'Platform for hosting and collaborating on code projects',
      favicon: 'https://github.githubassets.com/favicons/favicon.svg',
      imageUrl: 'https://github.githubassets.com/images/modules/site/social-cards/github-social.png'
    },
    {
      title: 'Stack Overflow - Developer Community',
      url: 'https://stackoverflow.com',
      category: 'development',
      tags: ['coding', 'community', 'q&a'],
      notes: 'Question and answer site for programmers',
      favicon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico',
      imageUrl: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png'
    },
    {
      title: 'YouTube',
      url: 'https://youtube.com',
      category: 'entertainment',
      tags: ['video', 'streaming'],
      notes: 'Video sharing platform',
      favicon: 'https://www.youtube.com/s/desktop/65401752/img/favicon_32x32.png',
      imageUrl: 'https://www.youtube.com/img/desktop/yt_1200.png'
    },
    {
      title: 'Netflix',
      url: 'https://netflix.com',
      category: 'entertainment',
      tags: ['streaming', 'movies', 'tv'],
      notes: 'Streaming service for movies and TV shows',
      favicon: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico',
      imageUrl: 'https://assets.nflxext.com/ffe/siteui/vlv3/ab180a27-b661-44d7-a6d9-940cb32f2f4a/7fb7d346-fdcc-4306-acf6-8f5453309b77/US-en-20231009-popsignuptwoweeks-perspective_alpha_website_large.jpg'
    },
    {
      title: 'Unsplash - Free Images',
      url: 'https://unsplash.com',
      category: 'design',
      tags: ['photos', 'images', 'free'],
      notes: 'Beautiful free images and photos that you can download and use for any project',
      favicon: 'https://unsplash.com/favicon-32x32.png',
      imageUrl: 'https://unsplash.com/blog/content/images/2021/03/visualography.jpeg'
    },
    {
      title: 'Figma - Design Tool',
      url: 'https://figma.com',
      category: 'design',
      tags: ['design', 'ui', 'collaboration'],
      notes: 'Collaborative interface design tool',
      favicon: 'https://static.figma.com/app/icon/1/favicon.svg',
      imageUrl: 'https://cdn.sanity.io/images/599r6htc/localized/ad04404ec4b86ed072d38d5a335edd23dccf649a-2108x1048.png'
    }
  ];
};

// Sample categories for demonstration
export const getSampleCategories = () => {
  return [
    { id: 'development', name: 'Development', icon: 'code', position: 0 },
    { id: 'design', name: 'Design', icon: 'edit', position: 1 },
    { id: 'entertainment', name: 'Entertainment', icon: 'video', position: 2 },
    { id: 'productivity', name: 'Productivity', icon: 'clock', position: 3 },
    { id: 'social', name: 'Social Media', icon: 'share', position: 4 }
  ];
};

// Generate a sample bookmark with proper timestamps
export const generateSampleBookmark = (data: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt' | 'position' | 'clickCount'>): Omit<Bookmark, 'id'> => {
  const now = Timestamp.now();
  return {
    ...data,
    createdAt: now,
    updatedAt: now,
    position: 0,
    clickCount: 0
  };
}; 