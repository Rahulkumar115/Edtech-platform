const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/authMiddleware');

router.get('/', courseController.getAllCourses);

router.post('/', auth, courseController.createCourse);

router.post('/:courseId/lectures', auth, courseController.addLecture);

router.post('/:courseId/live', auth, courseController.addLiveClass);

router.get('/:courseId', courseController.getCourseById);
router.post('/:courseId/enroll', auth, courseController.enrollCourse);

router.delete('/:courseId', auth, courseController.deleteCourse);

// Enroll in a course
router.post('/:courseId/enroll', auth, courseController.enrollCourse);

// Get enrolled courses
router.get('/user/enrolled', auth, courseController.getEnrolledCourses);

// Payment Routes
router.post('/checkout', auth, courseController.checkout);
router.post('/paymentverification', auth, courseController.paymentVerification);

module.exports = router;