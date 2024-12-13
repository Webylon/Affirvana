import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { FirebasePurchase } from '../../../types/firebase';

const PURCHASES_COLLECTION = 'purchases';
const PURCHASES_PER_PAGE = 20;

export const createPurchase = async (purchase: Omit<FirebasePurchase, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, PURCHASES_COLLECTION), {
      ...purchase,
      status: 'completed',
      purchaseDate: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating purchase:', error);
    throw error;
  }
};

export const getUserPurchases = async (
  userId: string,
  lastDoc?: DocumentSnapshot
) => {
  try {
    let purchasesQuery = query(
      collection(db, PURCHASES_COLLECTION),
      where('userId', '==', userId),
      orderBy('purchaseDate', 'desc'),
      limit(PURCHASES_PER_PAGE)
    );

    if (lastDoc) {
      purchasesQuery = query(purchasesQuery, startAfter(lastDoc));
    }

    const snapshot = await getDocs(purchasesQuery);
    const purchases = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      purchaseDate: doc.data().purchaseDate.toDate()
    })) as FirebasePurchase[];

    return {
      purchases,
      lastDoc: snapshot.docs[snapshot.docs.length - 1]
    };
  } catch (error) {
    console.error('Error fetching purchases:', error);
    throw error;
  }
};