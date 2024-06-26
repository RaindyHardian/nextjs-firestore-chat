import { getUserById } from '@/utils/firebase/users';
import { checkChatRoomCreated } from '@/utils/firebase/chats';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import ChatBox from '@/components/ChatBox';
import Head from 'next/head';

const ChatsPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [initLoading, setInitLoading] = useState(true);

  const fetchUser = async (userId) => {
    try {
      const data = await getUserById(userId);
      setUser(data);

      const a = await checkChatRoomCreated(2, 1);
      console.log('a', a);
    } catch (error) {
      console.log('test', error);
    } finally {
      setInitLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && router.query.userId) {
      fetchUser(router.query.userId);
    }
  }, [router.isReady, router.query.userId]);

  if (initLoading) return <Spinner />;

  if (!user) return <Text>User doesn&apos;t exist</Text>;

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex direction={'column'} py="30px" px="80px" h="100vh" gap="20px">
        <Box
          border="1px solid black"
          borderRadius="10px"
          padding="5px"
          fontWeight={'semibold'}
          onClick={() => console.log(user)}
        >
          <Link href={`/`} textColor="gray.500">
            {'<='} Back to choose user
          </Link>
          <Text>Current User:</Text>
          <Text>id: {user?.id}</Text>
          <Text>username: {user?.username || user?.store_name}</Text>
        </Box>
        <ChatBox user={user} />
      </Flex>
    </>
  );
};

export default ChatsPage;
