const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Request = require('../models/Request');
const Software = require('../models/Software');
const User = require('../models/User');

const router = express.Router();

// Get all requests (manager/admin only)
router.get('/', auth, authorize(['manager', 'admin']), async (req, res) => {
  try {
    const requests = await Request.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Software, as: 'software', attributes: ['id', 'name'] }
      ]
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's own requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await Request.findAll({
      where: { userId: req.user.id },
      include: [{ model: Software, as: 'software', attributes: ['id', 'name'] }]
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new request
router.post('/', auth, async (req, res) => {
  try {
    const { softwareId, reason } = req.body;
    const request = await Request.create({
      userId: req.user.id,
      softwareId,
      reason,
      status: 'pending'
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update request status (manager/admin only)
router.put('/:id', auth, authorize(['manager', 'admin']), async (req, res) => {
  try {
    const { status, managerComment } = req.body;
    const request = await Request.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = status;
    request.managerComment = managerComment;
    request.reviewedBy = req.user.id;
    request.reviewedAt = new Date();
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all pending requests (manager/admin only)
router.get('/pending', auth, authorize(['manager', 'admin']), async (req, res) => {
  try {
    const requests = await Request.findAll({
      where: { status: 'pending' },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'manager', attributes: ['id', 'name', 'email'] },
        { model: Software, as: 'software', attributes: ['id', 'name'] }
      ]
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 