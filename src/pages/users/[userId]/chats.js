import { getUserById } from '@/utils/firebase/users';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';

const ChatsPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [initLoading, setInitLoading] = useState(true);

  const fetchChatList = async (userId) => {
    try {
      const data = await getUserById(userId);
      setUser(data);
    } catch (error) {
    } finally {
      setInitLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && router.query.userId) {
      fetchChatList(router.query.userId);
    }
  }, [router.isReady, router.query.userId]);

  if (initLoading) return <Spinner />;

  if (!user) return <Text>User doesn&apos;t exist</Text>;

  return (
    <Flex direction={'column'} py="30px" px="80px" maxH="100vh">
      <Box
        border="1px solid black"
        borderRadius="10px"
        padding="5px"
        fontWeight={'semibold'}
        onClick={() => console.log(user)}
      >
        <Text>Current User:</Text>
        <Text>id: {user?.id}</Text>
        <Text>username: {user?.username}</Text>
      </Box>
    </Flex>
  );
};

export default ChatsPage;
