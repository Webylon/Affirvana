import { 
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  limit,
  orderBy,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { LuxuryItem } from '../../types';

const ITEMS_COLLECTION = 'items';
const ITEMS_PER_PAGE = 50;

export const fetchItems = async (
  lastDoc?: DocumentSnapshot,
  category?: string
) => {
  try {
    let itemsQuery = query(
      collection(db, ITEMS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(ITEMS_PER_PAGE)
    );

    if (category) {
      itemsQuery = query(
        collection(db, ITEMS_COLLECTION),
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        limit(ITEMS_PER_PAGE)
      );
    }

    if (lastDoc) {
      itemsQuery = query(
        itemsQuery,
        startAfter(lastDoc)
      );
    }

    const snapshot = await getDocs(itemsQuery);
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LuxuryItem[];

    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return {
      items,
      lastDoc: lastVisible
    };
  } catch (error) {
    throw error;
  }
};

export const addItem = async (item: Omit<LuxuryItem, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, ITEMS_COLLECTION), {
      ...item,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const updateItem = async (id: string, updates: Partial<LuxuryItem>) => {
  try {
    const docRef = doc(db, ITEMS_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    throw error;
  }
};

export const deleteItem = async (id: string) => {
  try {
    const docRef = doc(db, ITEMS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    throw error;
  }
};