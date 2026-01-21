const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/authMiddleware'); 

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.json({ msg: 'Message sent successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/', auth, async (req, res) => {
    try {
        // Check if user is admin
        if(req.user.role !== 'admin') {
            return res.status(403).json({ msg: "Access denied" });
        }

        const messages = await Contact.find().sort({ date: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        if(req.user.role !== 'admin') return res.status(403).json({ msg: "Access denied" });
        
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ msg: "Message deleted" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;