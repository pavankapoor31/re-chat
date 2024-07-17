import React, { useEffect, useState } from 'react'
import app, { db } from '../server/firebaseConfig'
import { getDatabase, ref, set, push, get, serverTimestamp } from 'firebase/database'
import MessageBox from './MessageBox/MessageBox'
import { useParams } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import useFirebaseAuth from '../hooks/useFirebaseAuth'
const Write = () => {
    const { loading, currentUser } = useFirebaseAuth();
    const chatRoomData = useParams();
    const chatRoomId = chatRoomData.id;
    const [messages, setMessages] = useState([]);
    const fetchData = async () => {
        console.log(chatRoomId, 'chatRoomIdchatRoomIdchatRoomId')
        const dbRef = ref(db, `chatrooms/${chatRoomId}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            let snapshotVal = snapshot.val();
            let messagesList = [];
            console.log(snapshotVal,'snapshotVal')
             Object.entries(snapshotVal.messages).forEach(
                ([key,val])=>{
                    messagesList.push( {
                        id:key,
                        val
                    })
                }
            )
            console.log(messagesList,'messagesList')
        } else {
            console.log(snapshot, 'snapppp2')
        }
    }
    const addMessage = async (message) => {
        const payload = {
            createdBy: currentUser.uid,
            messageTime: serverTimestamp(),
            messageText: "new message",
            createdByName: `${currentUser.firstName} ${currentUser.lastName}`
        }
        const dbRef = ref(db, `chatrooms/${chatRoomId}/messages`);
        const newDbRef = push(dbRef);
        set(newDbRef, payload).then(
            (res) => {
                console.log('success', res)
            }
        );
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div>
            {
                messages.map(
                    (message, index) => {
                        return <MessageBox key={index} userName={message.createdByName} messageTime={message.messageTime} userMessage={message.messageText} />
                    }
                )
            }

            <button onClick={() => { addMessage("message") }}>add data</button>
        </div>
    )
}

export default Write