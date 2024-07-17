import React, { useEffect } from 'react';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import { Button, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();
    const { currentUser, loading } = useFirebaseAuth();

    useEffect(() => {
        console.log(currentUser, 'currentUser');
    }, [currentUser]);

    const navigateToChat = () => {
        navigate(`/chat:${currentUser.uid}`);
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
