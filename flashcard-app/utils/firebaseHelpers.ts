// utils/firebaseHelpers.ts
import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    where,
    deleteDoc,
  } from 'firebase/firestore';
  import { db } from '../firebase';
  
  /**
   * Create a new Set for a given user.
   * Returns the newly created setId.
   */
  export async function createSet(name: string, uid: string): Promise<string> {
    const setsRef = collection(db, 'sets');
    const docRef = await addDoc(setsRef, { name, uid });
    return docRef.id;
  }
  
  /**
   * Fetch all sets belonging to a specific user (uid).
   */
  export async function fetchUserSets(uid: string) {
    const setsRef = collection(db, 'sets');
    const q = query(setsRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
  
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  }
  
  /**
   * Delete a set by ID (and optionally handle subcollections).
   * If you want to delete all flashcards in the subcollection,
   * you'd need to iterate through and delete them as well or use a cloud function.
   */
  export async function deleteSet(setId: string) {
    await deleteDoc(doc(db, 'sets', setId));
  }
  
  /**
   * Add a flashcard to the subcollection `/sets/{setId}/flashcards`.
   */
  export async function addFlashcardToSet(
    setId: string,
    front: string,
    back: string,
    uid: string
  ) {
    const flashcardsRef = collection(db, 'sets', setId, 'flashcards');
    await addDoc(flashcardsRef, {
      front,
      back,
      uid,
    });
  }
  
  /**
   * Fetch flashcards in a given set (subcollection).
   */
  export async function fetchFlashcardsForSet(setId: string) {
    const flashcardsRef = collection(db, 'sets', setId, 'flashcards');
    const querySnapshot = await getDocs(flashcardsRef);
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  }
  
  /**
   * Delete a flashcard by setId and cardId in the subcollection.
   */
  export async function deleteFlashcard(setId: string, cardId: string) {
    const cardRef = doc(db, 'sets', setId, 'flashcards', cardId);
    await deleteDoc(cardRef);
  }