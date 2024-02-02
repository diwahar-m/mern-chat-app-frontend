import React,{useEffect, useState} from 'react';
import { ChatState } from '../../Content/ChatProvider';
import { Box, Text, IconButton, Spinner, FormControl, Input, useToast} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../../config/chatLogics';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import axios from 'axios';
import io from 'socket.io-client';
import './styles.css';
import Lottie from 'react-lottie'; 
import animationData from '../../animations/typing.json';

var ENDPOINT = 'http://localhost:3000' 
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    // to show  typing, using state 
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const defaultOptions = {
        loop: true, 
        autoplay: true, 
        animationData: animationData, 
        rendererDettings: {
            preserveAspectRation: 'xMidYMid slice'
        }
    }

    const toast = useToast();

    const { user, selectedChat, setSelectedChat, notification, setNotification} = ChatState();
    console.log(selectedChat);


    const fetchMessages = async()=>{
        if(!selectedChat) return; 
        try{
                const config = {
                    headers:{ 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    }
                }
                setLoading(true);
                const {data} = await axios.get(`/api/message/${selectedChat._id}`, config)
                setMessages(data);
                console.log(data)
                setLoading(false);

                socket.emit('join chat', selectedChat._id)
            }catch(err){   
                toast({
                    title: 'Error Occurred!',
                    description: 'Failed to load the Messages', 
                    status: 'error',
                    duration: 5000 , 
                    isCloseable: true, 
                    position: 'bottom'
                })
            }

    }

    useEffect(()=>{
        socket = io(ENDPOINT);
        // emitting in the "setup" in backend 
        socket.emit('setup',user);
        socket.on('connected',()=> setSocketConnected(true))
        socket.on('typing', ()=> setIsTyping(true)) 
        socket.on('stop typing',()=> setIsTyping(false))
    })


    useEffect(()=>{
        fetchMessages()

        selectedChatCompare = selectedChat
    },[selectedChat])

    useEffect(()=>{
        socket.on('message received',(newMessageReceived)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
                // give notification
                if(!notification.includes(newMessageReceived)){
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain);
                }

            }else{
                setMessages([...messages, newMessageReceived])
            }
        })
    })

    const sendMessage=async(e)=>{
        if(e.key==='Enter' && newMessage){
            socket.emit('stop typing',selectedChat._id)
            try{
                const config = {
                    headers:{ 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    }
                }

                const {data} = await axios.post('/api/message',{
                    content: newMessage, 
                    chatId: selectedChat._id
                }, config)

                console.log(data)

                setNewMessage(''); 
                socket.emit("new message", data)
                setMessages([...messages, data])

            }catch(err){
                toast({
                    title: 'Error Occurred!',
                    description: 'Failed to send the Message', 
                    status: 'error',
                    duration: 5000 , 
                    isCloseable: true, 
                    position: 'bottom'
                })
            }
        }
    }

    
    const typingHandler=(e)=>{
        setNewMessage(e.target.value);
        // Typing indicator logic
        if(!socketConnected) return; 

        if(!typing){
            setTyping(true);
            socket.emit("typing", selectedChat._id)
        }
        // we need to stop this is if user not typed for more than 3 secs. 
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000; 
        setTimeout(()=>{
            let currentTime = new Date().getTime(); 
            var timeDiff = currentTime - lastTypingTime;
            if(timeDiff >= timerLength && typing){
                socket.emit("stop typing", selectedChat._id);
                setTyping(false)
            }
        },timerLength)
    }

  return (
    <>
        { selectedChat ? (
            <>
                <Text
                    fontSize={{  base: '28px', md: '30px'}}
                    pb={3} px={2} w='100%'
                    fontFamily='Work sans' 
                    display='flex' 
                    justifyContent={{base: 'space-between'}}
                    alignItems='center'
                >
                    <IconButton 
                        display={{ base: 'flex', md: 'none'}} 
                        icon={<ArrowBackIcon/>}
                        onClick={()=> setSelectedChat('')}
                    />
                    {
                        !selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal 
                                    fetchAgain={fetchAgain} 
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )
                    }
                </Text>
                <Box
                    display='flex' flexDir='column' 
                    justifyContent='flex-end' 
                    p={3} bg='#E8E8E8' w='100%' h='100%' 
                    borderRadius='lg' overflowY='hidden'
                >
                    
                    {loading ? ( <Spinner 
                        size='xl' w={20} h={20} alignSelf='center' margin='auto'
                    />) : (
                        <div className='messages'>
                            <ScrollableChat messages={messages}/>

                        </div>
                    )}
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        {isTyping ? 
                            <div>
                                <Lottie 
                                options={defaultOptions} width={70} 
                                style={{marginBottom: 15, marginLeft: 0}}
                                />
                            </div> : <></>}
                        <Input 
                            variant='filled' bg='#E0E0E0' 
                            placeholder='Enter a message...' 
                            onChange={typingHandler} value={newMessage}
                        />
                    </FormControl>
                </Box>
            </>
        ) : (
            <Box
                display='flex' alignItems='center'
                 justifyContent='center' h='100%'
            >
                <Text
                    fontSize='3xl' pb={3} fontFamily='Work sans'
                >
                    Click on a user to start chatting 
                </Text>
            </Box>
        )}
    
    </>
  )
}

export default SingleChat
