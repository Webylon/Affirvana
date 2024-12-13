import { collection, addDoc, query, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { luxuryItems } from '../../../data/luxuryItems';
import { FirebaseItem } from '../../../types/firebase';
import { generateRandomPrice } from '../../../utils/pricing';
import { generateRandomRating } from '../../../utils/ratings';
import { assignCategory } from '../../../utils/categories';

const ITEMS_COLLECTION = 'items';
const BATCH_SIZE = 500;

export const seedItems = async () => {
  try {
    // Check if items already exist
    const itemsQuery = query(collection(db, ITEMS_COLLECTION));
    const snapshot = await getDocs(itemsQuery);
    
    if (!snapshot.empty) {
      console.log('Items already seeded');
      return;
    }

    // Prepare items for seeding
    const items = luxuryItems.map(item => {
      const category = assignCategory(item.description);
      const { rating, ratingCount } = generateRandomRating();
      
      return {
        title: item.title,
        description: item.description,
        price: generateRandomPrice(category),
        imageUrl: item.image,
        category,
        rating,
        ratingCount,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // Seed items in batches
    const batches = [];
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const batchItems = items.slice(i, i + BATCH_SIZE);
      
      batchItems.forEach(item => {
        const docRef = doc(collection(db, ITEMS_COLLECTION));
        batch.set(docRef, item);
      });
      
      batches.push(batch.commit());
    }

    await Promise.all(batches);
    console.log('Successfully seeded items');
  } catch (error) {
    console.error('Error seeding items:', error);
    throw error;
  }
};