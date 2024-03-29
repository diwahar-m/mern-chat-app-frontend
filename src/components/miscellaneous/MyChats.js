import React, {useState, useEffect} from 'react';
import { ChatState } from '../../Content/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from '../ChatLoading';
import { getSender } from '../../config/chatLogics';
import GroupChatModal from './GroupChatModal';



const MyChats = ({fetchAgain}) => {

  const [loggedUser, setLoggedUser] = useState();

  const {selectedChat, setSelectedChat, user, chats, setChats} = ChatState();
  console.log( selectedChat)
  console.log(chats)
  const toast = useToast();

  const fetchChats = async()=>{
    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const {data} = await axios.get('/api/chats', config);
      console.log(data)
      setChats(data);
      
    } catch(err){
      toast({
        title: 'Error Occurred !',
        decription: "failed to load the chats",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })

    }
  }

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  },[fetchAgain])

  return (
    <Box
      display={{ base: (selectedChat? "none" : "flex"), md: 'flex'}}
      // display='flex'
      flexDirection='column'
      alignItems='center'
      p={3}
      bg='white'
      w={{ base: '100%', md: '31%'}}
      // h={'90vh'}
      borderRadius='lg'
      borderWidth='1px'
    >
      <Box
        pb={3} px={3}
        fontSize={{ base: '28px', md: '30px'}}
        fontFamily='Work sans'
        display='flex' w='100%'
        justifyContent='space-between'
        alignItems='center'
      >
         My Chats

        <GroupChatModal>
          <Button
            display='flex'
            fontSize={{ base: '17px', md:'10px', lg:'17px'}}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>

      </Box>
      <Box
        display='flex'
        flexDirection='column'
        p={3} w='100%' h='100%'
        bg='#F8F8F8'
        borderRadius='lg'
        overFlowY='hidden'
      >
        {
          chats ? (
            <Stack  overflowY='scroll'>
              {chats.map((chat)=>(
                
                <Box
                  onClick={()=> setSelectedChat(chat)}
                  cursor='pointer'
                  bg={selectedChat === chat ? '#38B2AC' : '3E8E8E8'}
                  color ={selectedChat === chat ? 'white' : 'black'}
                  px={3} py={2} borderRadius='lg'
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat ? (
                      getSender(loggedUser, chat.users)
                    ): (chat.chatName)}
                  </Text>
                </Box>
              ))}

            </Stack>

          ) : (
            <ChatLoading/>
          )
        }

      </Box>
    </Box>
  )
}

export default MyChats
