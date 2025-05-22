const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Software = require('../models/Software');

const router = express.Router();

// Get all software
router.get('/', auth, async (req, res) => {
    try {
        const software = await Software.findAll();
        res.json(software);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get software by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const software = await Software.findByPk(req.params.id);
        if (!software) {
            return res.status(404).json({ message: "Software not found" });
        }
        res.json(software);
    } catch (error) {
        res.status(500).json({ message: "Error fetching software", error: error.message });
    }
});

// Create new software (admin only)
router.post('/', auth, authorize(['admin']), async (req, res) => {
    try {
        const { name, description } = req.body;
        const software = await Software.create({ name, description });
        res.status(201).json(software);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update software (admin only)
router.put('/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        const { name, description } = req.body;
        const software = await Software.findByPk(req.params.id);

        if (!software) {
            return res.status(404).json({ error: 'Software not found' });
        }

        software.name = name;
        software.description = description;
        await software.save();

        res.json(software);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete software (admin only)
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        const software = await Software.findByPk(req.params.id);

        if (!software) {
            return res.status(404).json({ error: 'Software not found' });
        }

        await software.destroy();
        res.json({ message: 'Software deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 