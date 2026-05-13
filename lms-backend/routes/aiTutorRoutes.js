const express = require('express');
const router = express.Router();
const { getTutorResponse } = require('../controllers/aiTutorController');
const { generateLiveQuiz } = require('../controllers/aiTutorController');

// POST route to handle chat messages
router.post('/ask', getTutorResponse);
router.get('/live-quiz', generateLiveQuiz);

module.exports = router;