import { firestore } from '@/utils/firebase/firebase';
import { getUserRef } from '@/utils/firebase/users';
import { Flex } from '@chakra-ui/react';
import {
  collection,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import ChatRoom from './ChatRoom';
import ChatRoomListItem from './ChatRoomListItem';

const ChatBox = ({ user }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleClickRoom = ({ room }) => {
    setSelectedRoom(room);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(firestore, 'chats'),
        where('participants_ref', 'array-contains', getUserRef(user?.id)),
        orderBy('latestMessage.created_at', 'desc')
      ),
      async (querySnapshot) => {
        const chatList = [];

        for (const doc of querySnapshot.docs) {
          const chatData = doc.data();
          const participantUserPromises = chatData.participants_ref.map(getDoc);

          // Wait for all user data to be retrieved before adding chat to list
          const participantUsers = await Promise.all(participantUserPromises);

          chatList.push({
            id: doc.id,
            ...chatData,
            participants_ref_data: participantUsers.map((userDocSnap) =>
              userDocSnap.data()
            ),
          });
        }

        setChatRooms(chatList);
      },
      (error) => {
        console.error('Error getting chat messages:', error);
      }
    );

    // Cleanup function to unsubscribe from the listener on component unmount
    return () => unsubscribe();
  }, [user?.id]);

  return (
    <Flex border={'1px solid'} borderColor="gray.800" minH="400px" flexGrow="1">
      <Flex
        direction="column"
        borderRight="1px solid black"
        alignItems="left"
        w="250px"
        flex="none"
      >
        {chatRooms.map((room) => (
          <ChatRoomListItem
            key={room.id}
            currentUser={user}
            room={room}
            selectedRoom={selectedRoom}
            handleClickRoom={handleClickRoom}
          />
        ))}
      </Flex>
      <ChatRoom selectedRoom={selectedRoom} currentUser={user} />
    </Flex>
  );
};

export default ChatBox;
