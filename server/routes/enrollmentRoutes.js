const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const authenticateUser = require('../middleware/authMiddleware');

// 📘 View all available courses (for students)
router.get('/courses', authenticateUser, async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'username');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Enroll in course
router.post('/enroll/:courseId', authenticateUser, async (req, res) => {
  const { userId, role } = req.user;

  if (role !== 'student') return res.status(403).json({ error: 'Only students can enroll' });

  const already = await Enrollment.findOne({ student: userId, course: req.params.courseId });
  if (already) return res.status(400).json({ error: 'Already enrolled in this course' });

  try {
    const enrollment = new Enrollment({ student: userId, course: req.params.courseId });
    await enrollment.save();
    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Enrollment failed' });
  }
});

// View my enrolled courses
router.get('/my-courses', authenticateUser, async (req, res) => {
  try {
    const enrolled = await Enrollment.find({ student: req.user.userId })
      .populate('course');
    res.json(enrolled.map(e => e.course));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

module.exports = router;
