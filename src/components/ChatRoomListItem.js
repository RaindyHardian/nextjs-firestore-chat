import { Avatar, Divider, Flex, Text } from '@chakra-ui/react';
import React from 'react';

const ChatRoomListItem = ({
  room,
  selectedRoom,
  currentUser,
  handleClickRoom = () => {},
}) => {
  const conversationPartner = room.participants_ref_data.find(
    (data) => data.id !== currentUser?.id
  );
  const latestMessage = room?.latestMessage;

  return (
    <>
      <Flex
        key={room.id}
        _hover={{ backgroundColor: 'gray.200' }}
        cursor="pointer"
        gap={'8px'}
        px="15px"
        height="70px"
        backgroundColor={
          selectedRoom
            ? selectedRoom?.id === room?.id
              ? 'gray.200'
              : 'unset'
            : 'unset'
        }
        alignItems={'center'}
        onClick={() => handleClickRoom({ room })}
      >
        <Avatar name={conversationPartner.username} src="" />
        <Flex
          h="100%"
          direction="column"
          overflow="hidden"
          justifyContent="center"
        >
          <Text
            fontWeight="semibold"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
            w="100%"
          >
            {conversationPartner.username}
          </Text>
          {latestMessage && (
            <Text
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflow="hidden"
              w="100%"
            >
              {latestMessage?.created_by === currentUser?.id
                ? `You: ${latestMessage?.message}`
                : `${latestMessage?.message}`}
            </Text>
          )}
        </Flex>
      </Flex>

      <Divider
        marginTop="0 !important"
        marginBottom="0 !important"
        borderColor="gray.700"
      />
    </>
  );
};

export default ChatRoomListItem;
