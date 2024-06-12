import { sendMessage } from '@/utils/firebase/chats';
import { Button, Divider, Flex, Textarea } from '@chakra-ui/react';
import React, { useState } from 'react';

const ChatMessageInput = ({ roomId, chatId, currentUser }) => {
  const [message, setMessage] = useState('');

  const scrollToBottomContainer = () => {
    const messageListElement = document.getElementById('message-list');

    if (messageListElement) {
      messageListElement?.scrollTo({
        left: 0,
        top: messageListElement?.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleClickSend = () => {
    sendMessage(chatId, message, currentUser?.id);
    setMessage('');

    // Scroll to bottom after updating messages
    setTimeout(() => {
      scrollToBottomContainer();
    }, 100);
  };

  return (
    <Flex direction="column" gap="5px">
      <Divider borderColor="gray.700" />
      <Flex p="10px" gap="5px">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          variant="outline"
          borderColor="gray.700"
          placeholder="write a message..."
        />
        <Button colorScheme="blue" onClick={handleClickSend}>
          Send
        </Button>
      </Flex>
    </Flex>
  );
};

export default ChatMessageInput;
