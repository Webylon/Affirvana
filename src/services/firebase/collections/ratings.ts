import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  runTransaction
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { FirebaseRating } from '../../../types/firebase';

const RATINGS_COLLECTION = 'ratings';
const ITEMS_COLLECTION = 'items';

export const addRating = async (rating: Omit<FirebaseRating, 'id'>) => {
  try {
    await runTransaction(db, async (transaction) => {
      // Check if user has already rated
      const existingRatingQuery = query(
        collection(db, RATINGS_COLLECTION),
        where('userId', '==', rating.userId),
        where('itemId', '==', rating.itemId)
      );
      
      const existingRatingDocs = await getDocs(existingRatingQuery);
      if (!existingRatingDocs.empty) {
        throw new Error('User has already rated this item');
      }

      // Add new rating
      const newRatingRef = await addDoc(collection(db, RATINGS_COLLECTION), {
        ...rating,
        createdAt: new Date()
      });

      // Update item's average rating
      const itemRef = doc(db, ITEMS_COLLECTION, rating.itemId);
      const itemDoc = await getDoc(itemRef);

      if (itemDoc.exists()) {
        const itemData = itemDoc.data();
        const currentRatingCount = itemData.ratingCount || 0;
        const currentRating = itemData.rating || 0;

        const newRatingCount = currentRatingCount + 1;
        const newRating = ((currentRating * currentRatingCount) + rating.rating) / newRatingCount;

        await updateDoc(itemRef, {
          rating: newRating,
          ratingCount: newRatingCount
        });
      }

      return newRatingRef.id;
    });
  } catch (error) {
    console.error('Error adding rating:', error);
    throw error;
  }
};