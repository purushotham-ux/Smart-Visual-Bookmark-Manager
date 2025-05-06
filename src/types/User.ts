import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  notes?: string | null;
  favicon?: string;
  createdAt: number | Timestamp;
  updatedAt: number | Timestamp;
  position: number;
  clickCount: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  position: number;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
} 