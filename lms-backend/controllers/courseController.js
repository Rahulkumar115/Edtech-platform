const Course = require('../models/Course');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Create a new Course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, category, thumbnail } = req.body;
    
    const newCourse = new Course({
      title,
      description,
      price,
      category,
      thumbnail,
      instructor: req.user.id 
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a YouTube Lecture to a Course
exports.addLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, videoId, isFree, notes } = req.body; // 1. Get 'notes' from input

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // 2. Save 'notes' into the database
    course.lectures.push({ title, videoId, isFree, notes }); 
    
    await course.save();

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Courses (For the Home Page)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Add a Live Class
exports.addLiveClass = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { topic, date, time, meetingLink } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Verify user is the instructor (Optional security step)
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    course.liveClasses.push({ topic, date, time, meetingLink });
    await course.save();

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get Single Course (For Course Details Page)
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('instructor', 'name');
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Enroll a student in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const user = await User.findById(studentId);
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ msg: "Already enrolled" });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    res.json({ msg: "Enrolled successfully", enrolledCourses: user.enrolledCourses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Course (Admin Only)
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Check if user is Admin (Double security check)
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Course.findByIdAndDelete(courseId);
    res.json({ msg: 'Course removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Enroll in a Course
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Check if already enrolled
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ msg: 'Already enrolled' });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    res.json({ msg: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Enrolled Courses (For Student Dashboard)
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('enrolledCourses');
    res.json(user.enrolledCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 1. Create Razorpay Order
exports.checkout = async (req, res) => {
  try {
    const { courseId } = req.body;
    console.log("recieved checkout request for course id:", courseId);
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ msg: 'Course not found' });

    console.log("course price found:", course.price);
    console.log("calculated amount:", Number(course.price*100));

    console.log("found course:", course.title);
    console.log("key id present?", !!process.env.RAZORPAY_API_KEY);

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET,
    });

    const options = {
      amount: Number(course.price * 100),
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    console.log("order created successfully");

    res.status(200).json({
      success: true,
      order,
      course
    });

  } catch (err) {
    console.log("razorpay error:", err);
    res.status(500).json({ error: err.message });
  }
};

// 2. Verify Payment & Enroll User
exports.paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
    const userId = req.user.id;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment Successful -> Enroll User
      const user = await User.findById(userId);
      
      // Prevent duplicate enrollment
      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      res.redirect(`http://localhost:5173/student/dashboard`); // Redirect to frontend
    } else {
      res.status(400).json({
        success: false,
        msg: "Payment verification failed"
      });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};