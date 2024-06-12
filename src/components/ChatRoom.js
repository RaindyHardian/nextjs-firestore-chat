import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import ChatMessageInput from './ChatMessageInput';
import ChatMessageList from './ChatMessageList';

const ChatRoom = ({ currentUser, selectedRoom }) => {
  const conversationPartner = selectedRoom?.participants_ref_data?.find(
    (data) => data.id !== currentUser?.id
  );

  if (!selectedRoom)
    return (
      <Flex px="15px" py="10px">
        Select a chat
      </Flex>
    );

  return (
    <Flex direction="column" w="full">
      <Flex
        gap={'8px'}
        py="10px"
        px="15px"
        onClick={() => {
          console.log('selectedRoom', selectedRoom);
        }}
        height="70px"
        borderBottom="1px solid"
        borderColor="gray.800"
      >
        <Avatar name={conversationPartner.username} src="" />
        <Flex h="100%" alignItems="center">
          <Text fontWeight="semibold">{conversationPartner.username}</Text>
        </Flex>
      </Flex>
      <Flex direction="column" overflow="hidden" flexGrow="1">
        <ChatMessageList chatId={selectedRoom.id} currentUser={currentUser} />
        <ChatMessageInput chatId={selectedRoom.id} currentUser={currentUser} />
      </Flex>
    </Flex>
  );
};

export default ChatRoom;
