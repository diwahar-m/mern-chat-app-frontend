import { createContext, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";


const ChatContext = createContext();

const ChatProvider = ({children}) =>{

    // const history = useHistory();

    const [user, setUser] = useState('');
    const [selectedChat ,setSelectedChat] = useState([]);
    const [chats, setChats] = useState([]);

    useEffect(()=>{
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        console.log(userInfo)
        setUser(userInfo);

        // if(!userInfo){
        //     history.push('/')
        // }
        if(!userInfo) window.history.pushState({}, '', '/');

    },[window.history])

    return(

    <ChatContext.Provider value={{ user, setUser,selectedChat, setSelectedChat, chats, setChats}}>
        {children}
    </ChatContext.Provider>
    )
}

export const ChatState = ()=>{
    return useContext(ChatContext)
}

export default ChatProvider;