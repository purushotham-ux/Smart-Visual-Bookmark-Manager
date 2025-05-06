/// <reference types="react-scripts" />

// Add Timestamp type augmentation for Firestore
declare namespace FirebaseFirestore {
  interface Timestamp {
    toMillis(): number;
    toDate(): Date;
  }
} 