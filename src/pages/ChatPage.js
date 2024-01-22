import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChatState } from '../Content/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/miscellaneous/MyChats';
import ChatBox from '../components/miscellaneous/ChatBox';
import { useContext } from 'react';

const ChatPage = () => {

  const {user}=ChatState();
  
  useEffect(()=>{
   console.log(user);
  },[user])

  return (
    <div style={{ width: '100%'}}>
      {user && <SideDrawer/>}
      <Box 
        display='flex'
        justifyContent='space-between'
        w='100%'
        h='91.5h'
        p='10px'
      >
        {user && <MyChats/>}
        {user && <ChatBox/>}
      </Box>
    </div>
  )
}

export default ChatPage
