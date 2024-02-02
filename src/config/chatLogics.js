export const getSender=(loggedUser, users)=>{
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name ;
}

export const getSenderFull=(loggedUser, users)=>{
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name ;
}

// messages, current message, index, userId
export const isSameSender = (messages, m,i, userId)=>{
    return(
        // checking index of all messages except the last one 
        // checking current & next message sender are not same. 
        // checking current message sender & user are not same.
        i < messages.length - 1 && 
        (messages[i + 1].sender._id !== m.sender._id || messages[i+1].sender._id === undefined) && 
        messages[i].sender._id !== userId
    )
}

export const isLastMessage = (messages, i, userId)=>{
    return(
        // checking index of all messages except the last one 
        // checking current message sender & user are not same. 
        // checking whether message has id.
        i === messages.length - 1 && 
        messages[messages.length-1].sender._id !== userId && 
        messages[messages.length-1].sender._id

    )
}

export const isSameSenderMargin = (messages, m, i, userId)=>{
    if(
        i < messages.length-1 && 
        messages[i+1].sender._id ===  m.sender._id && 
        messages[i].sender._id !== userId
    )
        return 33;
    else if(
        ( i < messages.length - 1 && 
            messages[i+1].sender._id !== m.sender._id && 
            messages[i].sender._id !== userId) || 
        ( i === messages.length-1 && messages[i].sender._id !== userId)
    ) return 0 
    else return "auto"
}

export const isSameUser = (messages, m,i)=>{
    
    console.log(m.sender._id);
    return i > 0 && (messages[i-1].sender._id === m.sender._id)
}