import React, { useEffect } from 'react';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import { Button, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import { push, ref, set } from 'firebase/database';
import { db } from '../../server/firebaseConfig';
import { toast } from 'react-toastify';
const Welcome = () => {
    const navigate = useNavigate();
    const { currentUser, loading } = useFirebaseAuth();

    useEffect(() => {
        console.log(currentUser, 'currentUser');
    }, [currentUser]);
    const createLinkId = async (user) => {
        const chatroomsRef = ref(db, 'chatrooms'); // Reference to the 'chatrooms' node in the database
        // Push a new room under 'chatrooms' to generate a unique room ID
        const newRoomRef = push(chatroomsRef);
        const roomId = newRoomRef.key; 
        set(newRoomRef, {
            createdAt: new Date().toISOString(),
            createdBy: currentUser.uid,
            // Add any additional initial data for the room
          }).then(() => {
            // Navigate to the new room URL
            navigator.clipboard.writeText(`/chat/${roomId}`);
            toast.success("Copied chat room link to clipboard")
            navigate(`/chat/${roomId}`);
          }).catch((error) => {
            console.error("Error creating room: ", error);
          });
        console.log('Link ID created: ', roomId);
    };
    
      // Example unique ID generator
      const generateUniqueId = () => {
        return Math.random().toString(36).substr(2, 9);
      };
      
    const navigateToChat = () => {
        
        createLinkId(currentUser)
        
    };

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
                    <Button variant="contained" color="primary" onClick={navigateToChat}>
                        Click to start new chat
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default Welcome;
