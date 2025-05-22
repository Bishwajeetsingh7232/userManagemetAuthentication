import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper
} from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%'
                    }}
                >
                    <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography component="h1" variant="h4" gutterBottom>
                        Access Denied
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        You don't have permission to access this page.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/')}
                        sx={{ mt: 2 }}
                    >
                        Return to Dashboard
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
};

export default Unauthorized; 