import React, { useEffect, useState } from 'react'
import app, { db } from '../server/firebaseConfig'
import { getDatabase, ref, set, push, get, serverTimestamp } from 'firebase/database'
import MessageBox from './MessageBox/MessageBox'
import { useParams } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import useFirebaseAuth from '../hooks/useFirebaseAuth'
import { Button, TextField } from '@mui/material'
const Write = () => {
    const { loading, currentUser } = useFirebaseAuth();
    const chatRoomData = useParams();
    const chatRoomId = chatRoomData.id;
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState([]);
    const fetchData = async () => {
        console.log(chatRoomId, 'chatRoomIdchatRoomIdchatRoomId')
        const dbRef = ref(db, `chatrooms/${chatRoomId}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            let snapshotVal = snapshot.val();
            let messagesList = [];
            console.log(snapshotVal, 'snapshotVal')
            Object.entries(snapshotVal.messages).forEach(
                ([key, val]) => {
                    messagesList.push({
                        id: key,
                        ...val
                    })
                }
            )
            setMessages(messagesList)
        } else {
            console.log(snapshot, 'snapppp2')
        }
    }
    const handleSendMessage = async () => {
        const payload = {
            createdBy: currentUser.uid,
            messageTime: serverTimestamp(),
            messageText: messageInput,
            createdByName: `${currentUser.firstName} ${currentUser.lastName}`
        }
        const dbRef = ref(db, `chatrooms/${chatRoomId}/messages`);
        const newDbRef = push(dbRef);
        set(newDbRef, payload).then(
            () => {
                console.log('success')
            }
        );
        setMessageInput("");
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className='bg-light p-1 mt-2 mx-auto' style={{ width: "80%" }}>
            {
                messages.map(
                    (message, index) => {
                        return <MessageBox key={index} userName={message.createdByName} messageTime={message.messageTime} userMessage={message.messageText} isSender={currentUser.uid === message.createdBy} />
                    }
                )
            }

            <div className="d-flex">
                <TextField className='flex-1 w-100 px-1' value={messageInput} onChange={(e) => { setMessageInput(e.target.value) }} />
                <Button className='btn btn-primary' onClick={handleSendMessage}>Send</Button>
            </div>
        </div>
    )
}

export default Write