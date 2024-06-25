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
    const newMessageRef = await addDoc(messagesRef, newMessage);
    await updateDoc(doc(firestore, 'chats', chatId), {
      latestMessage: { ...newMessage, message_id: newMessageRef.id, is_read: false },
    });

    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

export const checkChatRoomCreated = async (participant1Id, participant2Id) => {
  try {
    // Create a query against the collection
    const chatQuery = query(
      collection(firestore, 'chats'),
      where('participants', 'array-contains', String(participant1Id))
    );

    // Get the documents matching the query
    const chatSnapshot = await getDocs(chatQuery);

    // Check each document to see if it contains the second participant
    for (const chatDoc of chatSnapshot.docs) {
      const participants = chatDoc.data().participants;
      if (participants.includes(String(participant2Id))) {
        // found chat room ID
        return chatDoc.id; // Existing chat found
      }
    }

    return false; // No existing chat found
  } catch (error) {
    console.error('Error checking existing chat:', error);
    return false; // Return false if there's an error
  }
};

export const readLatestMessage = async (chatId, latestMessage = {}) => {
  try {
    await updateDoc(doc(firestore, 'chats', chatId), {
      latestMessage: { ...latestMessage, is_read: true },
    });

    console.log('Message read successfully!');
  } catch (error) {
    console.error('Error read message:', error);
  }
};
