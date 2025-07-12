"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CssBaseline,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  Paper,
  Avatar,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Alert,
  Snackbar,
  Tooltip,
  Badge,
  Divider,
} from "@mui/material"
import {
  School,
  Add,
  Edit,
  Delete,
  Person,
  ExitToApp,
  Dashboard,
  MenuBook,
  Analytics,
  MoreVert,
  Save,
  Cancel,
  Visibility,
  Settings,
  Notifications,
  TrendingUp,
  Group,
  Assignment,
} from "@mui/icons-material"

function InstructorDashboard() {
  const [courses, setCourses] = useState([])
  const [form, setForm] = useState({ title: "", description: "", content: "" })
  const [editCourseId, setEditCourseId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const navigate = useNavigate()
  const userName = localStorage.getItem("userName") || "Instructor"

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    if (!token || role !== "instructor") {
      navigate("/")
      return
    }
    fetchCourses()
  }, [navigate])

  const fetchCourses = async () => {
    setLoading(true)
    const token = localStorage.getItem("token")
    try {
      const res = await axios.get("http://localhost:5000/api/courses/my", {
        headers: { Authorization: token },
      })
      setCourses(res.data)
    } catch (err) {
      console.error(err)
      showSnackbar("Failed to load courses", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")

    if (!form.title.trim() || !form.description.trim() || !form.content.trim()) {
      showSnackbar("Please fill in all fields", "error")
      return
    }

    try {
      if (editCourseId) {
        const res = await axios.put(`http://localhost:5000/api/courses/${editCourseId}`, form, {
          headers: { Authorization: token },
        })
        setCourses(courses.map((c) => (c._id === editCourseId ? res.data : c)))
        setEditCourseId(null)
        showSnackbar("Course updated successfully!", "success")
      } else {
        const res = await axios.post("http://localhost:5000/api/courses", form, {
          headers: { Authorization: token },
        })
        setCourses([...courses, res.data])
        showSnackbar("Course created successfully!", "success")
      }
      setForm({ title: "", description: "", content: "" })
      setDialogOpen(false)
    } catch (err) {
      showSnackbar(editCourseId ? "Update failed" : "Error adding course", "error")
    }
  }

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token")
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: token },
      })
      setCourses(courses.filter((c) => c._id !== id))
      showSnackbar("Course deleted successfully!", "success")
    } catch (err) {
      showSnackbar("Delete failed", "error")
    }
    setAnchorEl(null)
  }

  const handleEdit = (course) => {
    setForm({
      title: course.title,
      description: course.description,
      content: course.content,
    })
    setEditCourseId(course._id)
    setDialogOpen(true)
    setAnchorEl(null)
  }

  const handleMenuClick = (event, course) => {
    setAnchorEl(event.currentTarget)
    setSelectedCourse(course)
  }

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity })
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  const handleNewCourse = () => {
    setForm({ title: "", description: "", content: "" })
    setEditCourseId(null)
    setDialogOpen(true)
  }

  // Calculate stats
  const totalStudents = courses.reduce((sum, course) => sum + (course.enrolledStudents || 0), 0)
  const avgRating =
    courses.length > 0
      ? (courses.reduce((sum, course) => sum + (course.rating || 4.5), 0) / courses.length).toFixed(1)
      : "0.0"

  return (
    <>
      <CssBaseline />

      {/* Enhanced Header */}
      <AppBar position="static" elevation={0} sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Toolbar>
          <School sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            EduPortal - Instructor
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={2} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton color="inherit">
                <Settings />
              </IconButton>
            </Tooltip>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: "rgba(255,255,255,0.2)" }}>
                <Person />
              </Avatar>
              <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
                {userName}
              </Typography>
            </Box>

            <Button color="inherit" onClick={handleLogout} startIcon={<ExitToApp />} sx={{ ml: 1 }}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {loading && <LinearProgress />}

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <MenuBook sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {courses.length}
              </Typography>
              <Typography variant="body2">Total Courses</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
              }}
            >
              <Group sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {totalStudents}
              </Typography>
              <Typography variant="body2">Total Students</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
              }}
            >
              <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {avgRating}
              </Typography>
              <Typography variant="body2">Average Rating</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                color: "white",
              }}
            >
              <Analytics sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {courses.filter((c) => c.isActive).length}
              </Typography>
              <Typography variant="body2">Active Courses</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Welcome Section */}
        <Paper sx={{ p: 4, mb: 4, background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome back, {userName}! 👋
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your courses and track student progress from your dashboard.
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={handleNewCourse}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Create Course
            </Button>
          </Box>
        </Paper>

        {/* My Courses Section */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Dashboard sx={{ mr: 2, color: "primary.main" }} />
            <Typography variant="h4" component="h2" fontWeight="bold">
              My Courses
            </Typography>
            <Chip label={`${courses.length} courses`} color="primary" sx={{ ml: 2 }} />
          </Box>

          {courses.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center" }}>
              <MenuBook sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No courses created yet
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Start by creating your first course to share knowledge with students!
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={handleNewCourse} sx={{ mt: 2 }}>
                Create Your First Course
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {courses.map((course) => (
                <Grid item xs={12} sm={6} lg={4} key={course._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 120,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <Assignment sx={{ fontSize: 48, color: "white" }} />
                      <IconButton
                        sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
                        onClick={(e) => handleMenuClick(e, course)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                        {course.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {course.description}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                        <Chip
                          icon={<Group />}
                          label={`${course.enrolledStudents || 0} students`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={course.isActive ? "Active" : "Draft"}
                          size="small"
                          color={course.isActive ? "success" : "default"}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        Created: {new Date(course.createdAt || Date.now()).toLocaleDateString()}
                      </Typography>
                    </CardContent>

                    <Divider />

                    <CardActions sx={{ p: 2, justifyContent: "space-between" }}>
                      <Button startIcon={<Visibility />} size="small" sx={{ borderRadius: 2 }}>
                        View Details
                      </Button>
                      <Box>
                        <Tooltip title="Edit Course">
                          <IconButton onClick={() => handleEdit(course)} color="primary">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>

      {/* Course Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => handleEdit(selectedCourse)}>
          <Edit sx={{ mr: 1 }} />
          Edit Course
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedCourse?._id)}>
          <Delete sx={{ mr: 1 }} />
          Delete Course
        </MenuItem>
      </Menu>

      {/* Course Form Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <MenuBook sx={{ mr: 1 }} />
            {editCourseId ? "Edit Course" : "Create New Course"}
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Course Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Course Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  multiline
                  rows={3}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Course Content"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  multiline
                  rows={6}
                  required
                  placeholder="Enter detailed course content, curriculum, and learning objectives..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => {
                setDialogOpen(false)
                setForm({ title: "", description: "", content: "" })
                setEditCourseId(null)
              }}
              startIcon={<Cancel />}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" startIcon={<Save />} sx={{ ml: 1 }}>
              {editCourseId ? "Update Course" : "Create Course"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add course"
        onClick={handleNewCourse}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <Add />
      </Fab>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default InstructorDashboard;
