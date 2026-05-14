const express = require('express');
const router = express.Router();
const { getTutorResponse, generateLiveQuiz, checkAtsScore } = require('../controllers/aiTutorController');

// POST route to handle chat messages
router.post('/ask', getTutorResponse);
router.get('/live-quiz', generateLiveQuiz);
router.post('/ats-scan', checkAtsScore);

module.exports = router;