import { ViewIcon } from '@chakra-ui/icons';
import React, { useState} from 'react';
import { Button, IconButton, Modal, ModalBody,
   ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, useDisclosure, Image, Text, useToast, Input, Box, FormControl, Spinner } from '@chakra-ui/react';
import { ChatState } from '../../Content/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {

    const {isOpen, onOpen, onClose} = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    const {selectedChat, setSelectedChat, user} = ChatState();
    console.log(selectedChat);
    console.log(user.token)
    
    const handleAddUser=async(user1)=>{
      if(selectedChat.users.find(u => u._id === user1._id)){
        toast({
          title:'User already in the group',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom',

        })
        return;
      }

      if(selectedChat.groupAdmin._id !== user._id){
        toast({
          title:'Only admins can add someone!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        return;
      }

      try{
        setLoading(true);

        const config = {
          headers:{
            Authorization: `Bearer ${user.token}`
          }
        };

        const {data} = await axios.put('/api/chats/groupadd', {
          chatId: selectedChat._id,
          userId: user1._id
        }, config);

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);

      }catch(err){
        toast({
          title:'Error Occurred',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        setLoading(false);
      }

    }

    const handleRemove=async(user1)=>{
      // if a user is not a admin && user removing another user
      if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
        toast({
          title:'Only admin can remove someone',              
          status: 'error',
          duration: 5000,
          isClosable: true,     
          position:'bottom',

        })
        return;
      }

      
      try{
        setLoading(true);

        const config = {
          headers:{
            Authorization: `Bearer ${user.token}`
          }
        };

        const {data} = await axios.put('/api/chats/groupremove', {
          chatId: selectedChat._id,
          userId: user1._id
        }, config);

        user1._id === user._id ? selectedChat(): setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);

      }catch(err){
        toast({
          title:'Error Occurred',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        setLoading(false);
      }

    }

    const handleRename= async()=>{
      if(!groupChatName) return

      try{
        setRenameLoading(true);

        const config = {
          headers:{
            Authorization: `Bearer ${user.token}`
          }
        }
        const {data} = await axios.put('/api/chats/rename', {
          chatId: selectedChat._id,
          chatName: groupChatName,
        }, config);
        console.log(data);

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);

      }catch(err){
        toast({
          title: 'Error Occurred!',
          description: err.response.data.message,
          status: 'error',
          duration: 5000, 
          position: 'bottom'
        });
        setRenameLoading(false);
      } 
      setGroupChatName('');
    }

    const handleSearch=async(query)=>{
        setSearch(query);
      if(!query) return;
      try{
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        const { data} = await axios.get(`/api/user?search=${search}`, config)
        console.log( data);
        setLoading(false);
        setSearchResult(data);



      }catch(err){
        toast({
          title: 'Error Occurred',
          description: 'Failed to load the Search Results',
          status: "error",
          duration: 5000,
          isClosable: true,
          position: 'bottom-left'
        })
      }
    }

  return (
    <>
        <IconButton d={{ base: 'flex'}} icon={<ViewIcon />} onClick={onOpen} />
      

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w='100%' display='flex' flexWrap='wrap' pb={3}>
                {
                    selectedChat.users.map( user =>(
                        <UserBadgeItem key={ user._id} user={user} 
                            handleFunction ={()=> handleRemove(user)}
                        />
                    ))
                }
            </Box>
            <FormControl display='flex'>
                <Input placeholder='Update chatname' mb={3} value={groupChatName}
                 onChange={(e)=> setGroupChatName(e.target.value)}/>
                 <Button variant='solid' ml={1} 
                    isLoading={renameLoading}
                     onClick={handleRename}
                 >Update</Button>
            </FormControl>
            <FormControl>
                <Input placeholder='Add the User' mb={1} 
                  onChange={e => handleSearch(e.target.value)}/>
            </FormControl>
            {
              loading ? (
                <Spinner size='lg'/> 
              ) : (
                searchResult?.map(user => (
                  <UserListItem 
                    key={user._id}
                    user={user} 
                    handleFunction={()=> handleAddUser(user)}
                  />
                ))
              )
            }

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={()=>handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
