const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, authorize(['admin']), async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get users by department (Manager only)
router.get('/department/:department', auth, authorize(['manager', 'admin']), async (req, res) => {
    try {
        const users = await User.findAll({
            where: { 
                department: req.params.department,
                role: 'employee'
            },
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching department users", error: error.message });
    }
});

// Update user role (admin only)
router.put('/:id/role', auth, authorize(['admin']), async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update user status (Admin only)
router.patch('/:userId/status', auth, authorize(['admin']), async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findByPk(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isActive = isActive;
        await user.save();

        res.json({ message: "User status updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user status", error: error.message });
    }
});

// Update user profile (Self only)
router.patch('/profile', auth, async (req, res) => {
    try {
        const { firstName, lastName, department } = req.body;
        const user = req.user;

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (department) user.department = department;

        await user.save();

        res.json({ 
            message: "Profile updated successfully",
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
});

// Change password (Self only)
router.patch('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error changing password", error: error.message });
    }
});

// Get user by ID (admin or self)
router.get('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 