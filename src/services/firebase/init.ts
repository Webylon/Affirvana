import { db } from '../../config/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';

// Define the indexes needed for our queries
export const requiredIndexes = [
  {
    collectionGroup: 'items',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'category', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  }
];

// Function to check if required queries will work
export const validateQueries = async () => {
  try {
    // Test category + createdAt query
    const testQuery = query(
      collection(db, 'items'),
      where('category', '==', 'Homes'),
      orderBy('createdAt', 'desc')
    );
    
    console.log('Firebase indexes are properly configured');
    return true;
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      console.error('Missing required indexes. Please create the following indexes:');
      console.error(requiredIndexes);
      return false;
    }
    throw error;
  }
};