import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Card,
    CardContent,
    Alert
} from '@mui/material';
import {
    Assessment,
    Computer,
    People,
    CheckCircle,
    Pending,
    Block
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { requestService, softwareService, userService } from '../services/api';

const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
        <CardContent>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Box sx={{ 
                        backgroundColor: `${color}.light`,
                        borderRadius: '50%',
                        p: 1,
                        display: 'flex'
                    }}>
                        {icon}
                    </Box>
                </Grid>
                <Grid item xs>
                    <Typography color="textSecondary" variant="body2" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {value}
                    </Typography>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError('');

                let dashboardStats = {};

                if (user.role === 'admin') {
                    // Admin stats
                    const [users, software, requests] = await Promise.all([
                        userService.getAllUsers(),
                        softwareService.getAllSoftware(),
                        requestService.getAllRequests()
                    ]);

                    dashboardStats = {
                        totalUsers: users.data.length,
                        totalSoftware: software.data.length,
                        totalRequests: requests.data.length,
                        pendingRequests: requests.data.filter(r => r.status === 'pending').length,
                        approvedRequests: requests.data.filter(r => r.status === 'approved').length,
                        rejectedRequests: requests.data.filter(r => r.status === 'rejected').length
                    };
                } else if (user.role === 'manager') {
                    // Manager stats
                    const [departmentRequests, departmentUsers] = await Promise.all([
                        requestService.getDepartmentRequests(user.department),
                        userService.getDepartmentUsers(user.department)
                    ]);

                    dashboardStats = {
                        departmentUsers: departmentUsers.data.length,
                        totalRequests: departmentRequests.data.length,
                        pendingRequests: departmentRequests.data.filter(r => r.status === 'pending').length,
                        approvedRequests: departmentRequests.data.filter(r => r.status === 'approved').length,
                        rejectedRequests: departmentRequests.data.filter(r => r.status === 'rejected').length
                    };
                } else {
                    // Employee stats
                    const myRequests = await requestService.getUserRequests();
                    dashboardStats = {
                        totalRequests: myRequests.data.length,
                        pendingRequests: myRequests.data.filter(r => r.status === 'pending').length,
                        approvedRequests: myRequests.data.filter(r => r.status === 'approved').length,
                        rejectedRequests: myRequests.data.filter(r => r.status === 'rejected').length
                    };
                }

                setStats(dashboardStats);
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error('Dashboard error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Welcome, {user.firstName}!
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Admin-specific stats */}
                {user.role === 'admin' && (
                    <>
                        <Grid item xs={12} sm={6} md={4}>
                            <StatCard
                                title="Total Users"
                                value={stats?.totalUsers || 0}
                                icon={<People sx={{ color: 'primary.main' }} />}
                                color="primary"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <StatCard
                                title="Total Software"
                                value={stats?.totalSoftware || 0}
                                icon={<Computer sx={{ color: 'secondary.main' }} />}
                                color="secondary"
                            />
                        </Grid>
                    </>
                )}

                {/* Manager-specific stats */}
                {user.role === 'manager' && (
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                            title="Department Users"
                            value={stats?.departmentUsers || 0}
                            icon={<People sx={{ color: 'primary.main' }} />}
                            color="primary"
                        />
                    </Grid>
                )}

                {/* Common stats for all roles */}
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Requests"
                        value={stats?.totalRequests || 0}
                        icon={<Assessment sx={{ color: 'info.main' }} />}
                        color="info"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Pending Requests"
                        value={stats?.pendingRequests || 0}
                        icon={<Pending sx={{ color: 'warning.main' }} />}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Approved Requests"
                        value={stats?.approvedRequests || 0}
                        icon={<CheckCircle sx={{ color: 'success.main' }} />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Rejected Requests"
                        value={stats?.rejectedRequests || 0}
                        icon={<Block sx={{ color: 'error.main' }} />}
                        color="error"
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard; 