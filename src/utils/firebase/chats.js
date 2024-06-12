import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';

export const getChatList = async (userId) => {
  const chatsRef = collection(firestore, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId.toString())
  );

  const querySnapshot = await getDocs(q);
  const chatList = [];

  querySnapshot.forEach((doc) => {
    chatList.push({ id: doc.id, ...doc.data() });
  });

  return chatList;
};
