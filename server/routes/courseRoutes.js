const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const authenticateUser = require('../middleware/authMiddleware');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

//Add new course (instructor only)
router.post('/', authenticateUser, async (req, res) => {
  const { title, description, content } = req.body;
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ error: 'Only instructors can add courses' });
  }

  try {
    const newCourse = new Course({
      title,
      description,
      content,
      instructor: req.user.userId
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add course' });
  }
});

//  View all courses by instructor
router.get('/my', authenticateUser, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ error: 'Only instructors can view their courses' });
  }

  try {
    const courses = await Course.find({ instructor: req.user.userId });

    // Add enrolled student count for each course
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const enrolledCount = await Enrollment.countDocuments({ course: course._id });
        return {
          ...course._doc, // spread course fields
          enrolledStudents: enrolledCount
        };
      })
    );

    res.json(coursesWithCounts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Update a course
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }

    const { title, description, content } = req.body;

    course.title = title || course.title;
    course.description = description || course.description;
    course.content = content || course.content;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete a course
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// 📘 View enrolled students for a course (instructor only)
router.get('/:id/students', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const courseId = req.params.id;

    const enrollments = await Enrollment.find({ course: courseId })
      .populate('student', 'username'); // only fetch username

    const students = enrollments.map((e) => ({
      id: e.student._id,
      username: e.student.username,
      enrolledAt: e.enrolledAt,
    }));

    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});
module.exports = router;
