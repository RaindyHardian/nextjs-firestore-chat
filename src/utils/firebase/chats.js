import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  Timestamp,
  limit,
  orderBy,
  updateDoc,
} from 'firebase/firestore';
import { firestore } from './firebase';
import { getUserRef } from './users';

export const getChatListByUserId = async (userId) => {
  const chatsRef = collection(firestore, 'chats');

  const userRef = getUserRef(userId);
  const q = query(
    chatsRef,
    where('participants_ref', 'array-contains', userRef)
  );

  const querySnapshot = await getDocs(q);
  const chatList = [];

  for (const doc of querySnapshot.docs) {
    const chatData = doc.data();
    const participantUserPromises = chatData.participants_ref.map(getDoc);

    // Wait for all user data to be retrieved before adding chat to list
    const participantUsers = await Promise.all(participantUserPromises);

    // Get latest message for each chat
    const latestMessageRef = collection(firestore, 'chats', doc.id, 'messages');
    const latestMessageQuery = query(
      latestMessageRef,
      orderBy('created_at', 'desc'),
      limit(1)
    );
    const latestMessageSnapshot = await getDocs(latestMessageQuery);

    let latestMessage = null;
    if (latestMessageSnapshot.size > 0) {
      latestMessage = latestMessageSnapshot.docs[0].data();
    }

    chatList.push({
      id: doc.id,
      ...chatData,
      participants_ref_data: participantUsers.map((userDocSnap) =>
        userDocSnap.data()
      ),
      latestMessage,
    });
  }

  return chatList;
};

export const sendMessage = async (chatId, message, userId) => {
  const messagesRef = collection(firestore, 'chats', chatId, 'messages');

  const newMessage = {
    message, // Replace with your message content field name
    created_at: Timestamp.now(), // Add a timestamp field for message creation time
    created_by: userId,
  };

  try {
    await addDoc(messagesRef, newMessage);
    await updateDoc(doc(firestore, 'chats', chatId), {
      latestMessage: newMessage,
    });

    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
