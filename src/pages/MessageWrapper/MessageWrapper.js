import React, { useEffect, useRef, useState } from 'react'
import app, { db } from '../../server/firebaseConfig'
import { getDatabase, ref, set, push, get, serverTimestamp, onValue } from 'firebase/database'
import MessageBox from '../../components/MessageBox/MessageBox'
import { useParams } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import useFirebaseAuth from '../../hooks/useFirebaseAuth'
import { Button, TextField } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
const MessageWrapper = () => {
    const { loading, currentUser } = useFirebaseAuth();
    const chatRoomData = useParams();
    const chatRoomId = chatRoomData.id;
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState([]);
    const scrollRef = useRef();

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
    const keyPress = (e) => {
        console.log(e.keyCode, 'keycodeeee')
        if (e.keyCode == 13) {
            handleSendMessage()
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    useEffect(() => {
        const dbRef = ref(db, `chatrooms/${chatRoomId}/messages`);

        // Listen for real-time updates
        const unsubscribe = onValue(dbRef, (snapshot) => {
            const snapshotVal = snapshot.val();
            if (snapshotVal) {
                const messagesList = Object.entries(snapshotVal).map(([key, val]) => ({
                    id: key,
                    ...val
                }));
                setMessages(messagesList);
                scrollRef.current.scrollIntoView()
            } else {
                setMessages([]);
            }
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [chatRoomId]);
    return (
        <div className='mx-auto' style={{ width: "80%" }}>
            <div className='bg-light p-1 mt-2 mx-auto overflow-auto' style={{ height: '80vh' }}>
                {
                    messages.map(
                        (message, index) => {
                            return <MessageBox key={index} userName={message.createdByName} messageTime={message.messageTime} userMessage={message.messageText} isSender={currentUser?.uid === message.createdBy} />
                        }
                    )
                }
                <div ref={scrollRef}> </div>

            </div>
            <div className="d-flex">
                <TextField className='flex-1 w-100 px-1' onKeyDown={keyPress} value={messageInput} onChange={(e) => { setMessageInput(e.target.value) }} />
                <Button onClick={handleSendMessage} variant="outlined" endIcon={<SendIcon />} >Send</Button>
                
            </div>
        </div>
    )
}

export default MessageWrapper