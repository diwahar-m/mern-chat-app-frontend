import React,{useState} from 'react';
import { Box, Button, Menu, Text, Tooltip,MenuButton, MenuItem,
     MenuList, Avatar, MenuDivider, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody,
      Input, DrawerFooter, useToast, Spinner} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Content/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import axios from 'axios';
import NotificationBadge,{Effect} from 'react-notification-badge';


const SideDrawer = () => {

    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const {user, setSelectedChat, chats, setChats, notification, setNotification} = ChatState();

    const history = useHistory();
    const toast = useToast();
    const {isOpen, onOpen, onClose}= useDisclosure();

    const logoutHandler=()=>{
        localStorage.removeItem('userInfo');
        history.push('/');
    }

    const handleSearch = async()=>{
        if(!search){
            toast({
                title: 'Please Enter something in search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'top-left'
            });
            return ;
        }

        try{
            setLoading(true);
            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            };

            const {data} = await axios.get(`/api/user?search=${search}`, config)
            console.log(data)
            setLoading(false);
            setSearchResult(data);
        }catch(err){
            toast({
                title: 'Error Occurred!',
                description: 'Failed to load the Search Results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }

    const accessChat= async(userId)=>{
        try{
            setLoadingChat(true);

            let config ={
                headers:{
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };

            const {data} = await axios.post('/api/chats',{userId}, config);

            // if chat id is already created , then we need to append our data there. So,
            // the same 2 members will not have repeated set of chats with different id's.
            if(chats.find(c => c._id === data._id)) setChats([data, ...chats]) 
 
            setSelectedChat(data)
            setLoadingChat(false);
            onClose();

        }catch(err){
            toast({
                title: 'Error fetching the data',
                description: err.message,
                status: 'error',
                duration: 5000,
                isCloseable: true,
                position: 'bottom-left'
            });
            setLoadingChat(false);
        }
    }


  return (
    <>
    <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        bg='white'
        w='100%'
        p='5px 10px'
        borderWidth='5px'
    >
      <Tooltip hasArrow placement='bottom-end' label='Search Users to chat'>
        <Button variant='ghost' onClick={onOpen}>
            <i class="fa fa-search" aria-hidden="true"></i>
            <Text d={{ base: 'none', md: 'flex'}} px='4'>Search User</Text>
        </Button>
      </Tooltip>
      <Text fontSize='2xl' fontFamily='Work sans'>Talk-A-Tive</Text>
      <div>
        <Menu>
            <MenuButton p={1} as={Button} >
                <NotificationBadge count={notification.length} effect={Effect.SCALE}/>
                <BellIcon fontSize='2xl' m={1}/>
            </MenuButton>
            <MenuList pl={2}>
                {!notification.length && "No New Messages"}
                {notification.map( notif => (
                    <MenuItem key={notif._id} onClick={()=>{
                        setSelectedChat(notif.chat); 
                        setNotification(notification.filter(n => n!==notif))
                    }}>
                        {notif.chat.isGroupChat ? 
                          `New message from ${notif.chat.chatName}` : 
                          `New message from ${getSender(user, notif.chat.users)}` 
                        }
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
        <Menu>
            <MenuButton p={1} as={Button} rightIcon={<ChevronDownIcon/>}>
                <Avatar 
                    size='sm' 
                    cursor='pointer' 
                    name={user.name} 
                    src={user.pic}
                />
            </MenuButton>
            <MenuList>
                <ProfileModal user={user}>
                    <MenuItem>My Profile</MenuItem>
                </ProfileModal>
                <MenuDivider/>
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
        </Menu>
      </div>
    </Box>

    <Drawer placement='left' onClose={onClose} isOpen={isOpen}> 
        <DrawerOverlay/> 
        <DrawerContent>
           <DrawerCloseButton />
           <DrawerHeader>Search Users</DrawerHeader>

            <DrawerBody>
                <Box display='flex' pb={2}>
                    <Input 
                        palceholder='Search by name or email'
                        mr={2}
                        value={search} 
                        onChange={e => setSearch(e.target.value)}
                    />
                    <Button 
                    onClick={handleSearch}
                    >Go</Button>
                </Box>
                { loading ? (
                    <ChatLoading />
                 ): (
                    searchResult?.map( user => (
                        <UserListItem key={user._id} user={user} 
                            handleFunction={()=> accessChat(user._id) } 
                        />
                    ))
                 )
                }
                { loadingChat && <Spinner ml='auto' display='flex'/>}
            </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
    </Drawer>
    </>

  )
}

export default SideDrawer
