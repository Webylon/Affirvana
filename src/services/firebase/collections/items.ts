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
import { db } from '../../../config/firebase';
import { FirebaseItem } from '../../../types/firebase';

const ITEMS_COLLECTION = 'items';
const ITEMS_PER_PAGE = 50;

export const fetchItems = async (
  lastDoc?: DocumentSnapshot,
  category?: string
) => {
  try {
    let baseQuery = collection(db, ITEMS_COLLECTION);
    let constraints = [limit(ITEMS_PER_PAGE)];

    if (category) {
      constraints = [
        where('category', '==', category),
        orderBy('category'),
        orderBy('createdAt', 'desc'),
        limit(ITEMS_PER_PAGE)
      ];
    } else {
      constraints = [
        orderBy('createdAt', 'desc'),
        limit(ITEMS_PER_PAGE)
      ];
    }

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const itemsQuery = query(baseQuery, ...constraints);
    const snapshot = await getDocs(itemsQuery);
    
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      isFavorite: false,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as FirebaseItem[];

    return {
      items,
      lastDoc: snapshot.docs[snapshot.docs.length - 1]
    };
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};