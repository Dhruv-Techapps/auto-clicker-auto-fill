import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface ConfigType {
  id: string;
  name: string;
  url: string;
  userId: string;
  userName?: string;
  tags?: string[];
  updated?: Timestamp;
  created?: Timestamp;
}

export const getConfig = async (id: string) => {
  const docRef = doc(db, 'configurations', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { ...(docSnap.data() as ConfigType), id: docSnap.id };
  }
  return undefined;
};
