const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const authenticateUser = require('../middleware/authMiddleware');

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

  const courses = await Course.find({ instructor: req.user.userId });
  res.json(courses);
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
module.exports = router;
