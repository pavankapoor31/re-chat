import SendIcon from '@mui/icons-material/Send'
import { Button, Skeleton, TextField, Typography } from '@mui/material'
import { get, onValue, push, ref, serverTimestamp, set } from 'firebase/database'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MessageBox from '../../components/MessageBox/MessageBox'
import useFirebaseAuth from '../../hooks/useFirebaseAuth'
import { db } from '../../server/firebaseConfig'
const MessageWrapper = () => {
    const { loading, currentUser } = useFirebaseAuth();
    const chatRoomData = useParams();
    const chatRoomId = chatRoomData.id;
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState([]);
    const scrollRef = useRef();
    const navigate = useNavigate();
    const fetchData = async () => {
        const dbRef = ref(db, `chatrooms/${chatRoomId}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            let snapshotVal = snapshot.val();
            let messagesList = [];
            if (snapshotVal.hasOwnProperty('messages'))
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
            navigate('/welcome');
        }
    }
    const handleSendMessage = async () => {
        // Avoid empty spaces. 
        if(messageInput.trim().length===0) return;
        const payload = {
            createdBy: currentUser.uid,
            messageTime: serverTimestamp(),
            messageText: messageInput,
            createdByName: `${currentUser.firstName} ${currentUser.lastName}`
        }
        const dbRef = ref(db, `chatrooms/${chatRoomId}/messages`);
        const newDbRef = push(dbRef);
        set(newDbRef, payload).catch(
            (err) => {
                console.error(err)
            }
        )
        setMessageInput("");
    }
    const keyPress = (e) => {
        // Check for enter pressed to send message. 
        if (e.keyCode === 13) {
            if(e.shiftKey === true)return;
            handleSendMessage()
        }
    }
    useEffect(() => {
        if (!chatRoomId) return;
        fetchData()
    }, [chatRoomId])
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


    useEffect(() => {
        if (!chatRoomId) return;
        const dbRef = ref(db, `chatrooms/${chatRoomId}`);

        // Listen for real-time updates
        const unsubscribe = onValue(dbRef, (snapshot) => {
            const snapshotExists = snapshot.exists();
            if (snapshotExists) {
                const snapshotValues = snapshot.val();
                if (snapshotValues.hasOwnProperty("disabled") && snapshotValues["disabled"]) {
                    navigate('/welcome');
                }
            } else {
                navigate('/welcome');
            }
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [chatRoomId,navigate]);
    return (
        <div className='mx-auto' style={{ width: "80%" }}>
            <div className='bg-light p-1 mt-2 mx-auto overflow-auto' style={{ height: '80vh' }}>
                {
                    !loading ? messages.map(
                        (message, index) => {
                            return <MessageBox key={index} userName={message.createdByName} messageTime={message.messageTime} userMessage={message.messageText} isSender={currentUser?.uid === message.createdBy} />
                        }
                    ) :
                        <Skeleton variant="rectangular" style={{ borderRadius: '25px' }} width={210} height={60} />
                }
                <div ref={scrollRef}> </div>

            </div>
            {!loading ? <div className="d-flex">
                <TextField className='flex-1 w-100 px-1' onKeyDown={keyPress} value={messageInput} onChange={(e) => { setMessageInput(e.target.value) }} placeholder='Type new message' />
                <Button onClick={handleSendMessage} variant="contained" ><SendIcon /></Button>
            </div> : <Typography variant="h1">{loading ? <Skeleton /> : 'h1'}</Typography>
            }
        </div>
    )
}

export default MessageWrapper