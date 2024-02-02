import React,{ useState} from 'react';
import { Button, IconButton, Modal, ModalBody,
   ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, useDisclosure, Image, Text, useToast, Input } from '@chakra-ui/react';
import {ChatState} from '../../Content/ChatProvider';
import { FormControl } from '@chakra-ui/react';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({children}) => {

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, chats, setChats} = ChatState();

  const handleSearch = async(query)=>{
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

  const handleGroup = (userToAdd)=>{
    if( selectedUsers.includes(userToAdd)){
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 5000, 
        isClosable: true, 
        position: 'top'
      })
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  const handleDelete=(delUser)=>{
    setSelectedUsers(selectedUsers.filter(user => user._id !== delUser._id))
  }


  const handleSubmit = async()=>{
    if(!groupChatName || !selectedUsers){
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 5000,
        isCloseable: true,
        position: 'top'
      });
      return ;
    }

    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      }

      const {data} = await axios.post('/api/chats/group', {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map(u => u._id))
      }, config)

      setChats([data, ...chats])
      onClose();
      toast({
        title: 'New group chat created',
        status: 'success',
        duration: 5000,
        isCloseable: true,
        position: 'bottom'
      })
    }catch(err){
      toast({
        title: 'Failed to create the chat',
        description: err.response.data,
        status: 'error',
        duration: 5000,
        isCloseable: true,
        position: 'bottom'
      })
    }
  }


  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            display='flex'
            justifyContent='center'
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />

          <ModalBody 
            display='flex' 
            flexDirection='column' 
            alignItems='center'
          > 
              <FormControl>
                <Input placeholder='Chat Name' mb={3} 
                  onChange={e => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input 
                  placeholder='Add Users eg: John, Piyush, Jane' 
                  mb={1} 
                  onChange={e => handleSearch(e.target.value)}
                />
              </FormControl>
              {/* selected users */}

              {
                selectedUsers.map( user => (
                  <UserBadgeItem key={ user._id} user={user} 
                    handleFunction ={()=> handleDelete(user)}
                  />
                ))
              }

              {/* to render searched users */}
              {
                 loading ? <div> Loading ...</div> :
                 searchResult?.slice(0,4).map( user =>
                  <UserListItem key={user._id} user={user} 
                    handleFunction = {()=> handleGroup(user)}
                  />)
              }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue'onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
