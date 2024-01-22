import React,{ useState} from 'react';
import { Button, IconButton, Modal, ModalBody,
   ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, useDisclosure, Image, Text, useToast, Input } from '@chakra-ui/react';
import {ChatState} from '../../Content/ChatProvider';
import { FormControl } from '@chakra-ui/react';


const GroupChatModal = ({children}) => {

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, chats, setChats} = ChatState();

  const handleSearch = (query)=>{
    setSearch(query);
    if(!query) return;
    try{
      setLoading(true);
      
    }catch(err){

    }
  }
  const handleSubmit = ()=>{

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
              {/* to render searched users */}
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
