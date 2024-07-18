import { Box, Button, Container, Typography } from '@mui/material';
import { equalTo, get, orderByChild, push, query, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import { db } from '../../server/firebaseConfig';

const Welcome = () => {
    const [alreadyHasChatLink, setAlreadyHasChatLink] = useState({ value: false });
    const navigate = useNavigate();
    const { currentUser, loading } = useFirebaseAuth();

    // Function to create a unique chat room link
    const createLinkId = async (user) => {
        const chatroomsRef = ref(db, 'chatrooms'); // Reference to the 'chatrooms' node in the database
        const newRoomRef = push(chatroomsRef); // Push a new room under 'chatrooms' to generate a unique room ID
        const roomId = newRoomRef.key; // Get the generated room ID

        // Set the new room data
        set(newRoomRef, {
            createdAt: new Date().toISOString(),
            createdBy: currentUser.uid,
        }).then(() => {
            // Copy the chat room link to the clipboard and navigate to the new room
            navigator.clipboard.writeText(`${window.location.host}/chat/${roomId}`);
            toast.success("Copied chat room link to clipboard. You can share this link to chat with others!", { autoClose: 6000, showIcon: false, position: 'top-center' });
            navigate(`/chat/${roomId}`);
        }).catch((error) => {
            console.error("Error creating room: ", error);
        });
    };

    // Function to navigate to the existing or new chat room
    const navigateToChat = () => {
        if (alreadyHasChatLink.value) {
            navigator.clipboard.writeText(`${window.location.host}/chat/${alreadyHasChatLink.link}`);
            navigate(`/chat/${alreadyHasChatLink.link}`);
        } else {
            createLinkId(currentUser);
        }
    };

    // useEffect to check if the user already has a chat link
    useEffect(() => {
        if (loading) return;
        if (!currentUser) {
            navigate('/signin');
            return;
        }

        const chatRoomRef = ref(db, 'chatrooms');
        const chatRoomQueryRef = query(chatRoomRef, orderByChild('createdBy'), equalTo(currentUser.uid));
        get(chatRoomQueryRef).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const chatRoom = childSnapshot.val();
                const chatRoomId = childSnapshot.key;

                if (!chatRoom.disabled) {
                    setAlreadyHasChatLink({
                        value: true,
                        link: chatRoomId
                    });
                }
            });
        });
    }, [currentUser, loading, navigate]);

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            {!loading && currentUser && (
                <Box sx={{ textAlign: 'center', padding: 4, boxShadow: 3, borderRadius: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Welcome to Re-chat, <span style={{ fontWeight: 700 }}>{currentUser.firstName}</span>!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Re-chat is a React chat application built using React & Firebase.
                    </Typography>
                    {alreadyHasChatLink.value && (
                        <Typography variant="body1" paragraph>
                            You already have an existing chat!
                        </Typography>
                    )}
                    <Button variant="contained" color="primary" onClick={navigateToChat}>
                        Click to {alreadyHasChatLink.value ? 'continue existing' : 'start new'} chat
                    </Button>
                </Box>
            )}
            {!loading && !currentUser && (
                <Box sx={{ textAlign: 'center', padding: 4, boxShadow: 3, borderRadius: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Welcome to Re-chat, <span style={{ fontWeight: 700 }}>user</span>!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Re-chat is a React chat application built using React & Firebase.
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => { navigate('/signin') }}>
                        Click to start login!
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default Welcome;
