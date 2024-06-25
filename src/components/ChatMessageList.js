import React, { useEffect, useRef, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { firestore } from '@/utils/firebase/firebase';
import { Box, Flex, Text } from '@chakra-ui/react';
import { readLatestMessage } from '@/utils/firebase/chats';

const ChatMessageList = ({ selectedRoom, chatId, currentUser }) => {
  const messageListRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [firstInit, setFirstInit] = useState(true);

  const scrollToBottomContainer = () => {
    const messageListElement = document.getElementById('message-list');

    if (messageListElement) {
      messageListElement?.scrollTo({
        left: 0,
        top: messageListElement?.scrollHeight,
        behavior: 'auto',
      });
    }
  };

  useEffect(() => {
    setFirstInit(true);

    const unsubscribe = onSnapshot(
      query(
        collection(firestore, 'chats', chatId, 'messages'),
        orderBy('created_at', 'asc')
      ),
      (querySnapshot) => {
        const newMessages = [];
        querySnapshot.forEach((doc) => {
          newMessages.push({ id: doc.id, ...doc.data() });
        });
        setMessages(newMessages);

        if (firstInit) {
          // Scroll to bottom after updating messages
          setTimeout(() => {
            scrollToBottomContainer();
            setFirstInit(false);
          }, 100);
        }
      },
      (error) => {
        console.error('Error getting chat messages:', error);
      }
    );

    // Cleanup function to unsubscribe from the listener on component unmount
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  return (
    <Box id="message-list" overflow="auto" flex="1" py="10px" px="10px">
      <Flex direction="column" gap="10px">
        {messages.map((message, index) => (
          <Flex
            key={message.id}
            justifyContent={
              currentUser?.id === message.created_by ? 'right' : 'left'
            }
            onClick={() => console.log('message', message)}
          >
            <Flex
              direction="column"
              alignItems={
                currentUser?.id === message.created_by ? 'end' : 'start'
              }
            >
              <Flex
                display="inline-flex"
                background="gray.200"
                borderRadius="5px"
                paddingY="10px"
                paddingX="15px"
                w="max-content"
                onClick={() => {
                  if (
                    selectedRoom?.latestMessage?.created_by === currentUser?.id
                  ) {
                    return;
                  }

                  if (index === messages?.length - 1) {
                    readLatestMessage(chatId, selectedRoom?.latestMessage);
                  }
                }}
              >
                {message?.message}
              </Flex>
              <Text display="block">
                {new Date(
                  message.created_at.seconds * 1000 +
                    Math.floor(message.created_at.nanoseconds / 1000000)
                ).toLocaleString()}
              </Text>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default ChatMessageList;
