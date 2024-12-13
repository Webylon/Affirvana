import {
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  doc
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { LuxuryItem } from '../../../types';

const FAVORITES_COLLECTION = 'favorites';

interface FavoriteItem {
  userId: string;
  itemId: string;
  item: LuxuryItem;
  dateAdded: Date;
}

export const addToFavorites = async (userId: string, item: LuxuryItem) => {
  try {
    const favorite: Omit<FavoriteItem, 'id'> = {
      userId,
      itemId: item.id,
      item,
      dateAdded: new Date()
    };

    const docRef = await addDoc(collection(db, FAVORITES_COLLECTION), favorite);
    return docRef.id;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (userId: string, itemId: string) => {
  try {
    const favoritesQuery = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId),
      where('itemId', '==', itemId)
    );

    const snapshot = await getDocs(favoritesQuery);
    const favoriteDoc = snapshot.docs[0];

    if (favoriteDoc) {
      await deleteDoc(doc(db, FAVORITES_COLLECTION, favoriteDoc.id));
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const getUserFavorites = async (userId: string) => {
  try {
    const favoritesQuery = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(favoritesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (FavoriteItem & { id: string })[];
  } catch (error) {
    console.error('Error getting user favorites:', error);
    throw error;
  }
};