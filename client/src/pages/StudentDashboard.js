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
  Chip,
  Avatar,
  Paper,
  TextField,
  InputAdornment,
  Fab,
  Divider,
  LinearProgress,
  Alert,
  Snackbar,
  IconButton,
  Badge,
  Tooltip,
} from "@mui/material"
import {
  School,
  BookmarkBorder,
  Bookmark,
  Search,
  Person,
  ExitToApp,
  Dashboard,
  MenuBook,
  CheckCircle,
  Add,
  FilterList,
  Notifications,
  Settings,
} from "@mui/icons-material"

function StudentDashboard() {
  const [courses, setCourses] = useState([])
  const [enrolled, setEnrolled] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")
  const userName = localStorage.getItem("userName") || "Student"

  useEffect(() => {
    if (!token || role !== "student") {
      navigate("/")
      return
    }
    fetchData()
  }, [token, role, navigate])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [coursesRes, enrolledRes] = await Promise.all([
        axios.get("http://localhost:5000/api/student/courses", {
          headers: { Authorization: token },
        }),
        axios.get("http://localhost:5000/api/student/my-courses", {
          headers: { Authorization: token },
        }),
      ])
      setCourses(coursesRes.data)
      setEnrolled(enrolledRes.data)
    } catch (err) {
      console.error("Fetch error:", err)
      showSnackbar("Failed to load data", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/student/enroll/${id}`, {}, { headers: { Authorization: token } })
      showSnackbar("Successfully enrolled in course!", "success")
      fetchData() // Refresh data
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Enrollment failed", "error")
    }
  }

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity })
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const isEnrolled = (courseId) => enrolled.some((e) => e._id === courseId)

  return (
    <>
      <CssBaseline />

      {/* Enhanced Header */}
      <AppBar position="static" elevation={0} sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Toolbar>
          <School sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            EduPortal
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
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
              <Dashboard sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {enrolled.length}
              </Typography>
              <Typography variant="body2">Enrolled Courses</Typography>
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
              <MenuBook sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {courses.length}
              </Typography>
              <Typography variant="body2">Available Courses</Typography>
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
              <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {Math.round((enrolled.length / courses.length) * 100) || 0}%
              </Typography>
              <Typography variant="body2">Completion Rate</Typography>
            </Paper>
          </Grid>
          {/* <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                color: "white",
              }}
            >
              <School sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                A+
              </Typography>
              <Typography variant="body2">Average Grade</Typography>
            </Paper>
          </Grid> */}
        </Grid>

        {/* Search and Filter Section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button fullWidth variant="outlined" startIcon={<FilterList />} sx={{ height: 56, borderRadius: 2 }}>
                Filter Courses
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* All Courses Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <MenuBook sx={{ mr: 2, color: "primary.main" }} />
            <Typography variant="h4" component="h2" fontWeight="bold">
              Discover Courses
            </Typography>
            <Chip label={`${filteredCourses.length} courses`} color="primary" sx={{ ml: 2 }} />
          </Box>

          <Grid container spacing={3}>
            {filteredCourses.map((course) => (
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
                  <Box sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        height: 120,
                        background: `linear-gradient(135deg, ${
                          isEnrolled(course._id) ? "#4caf50, #81c784" : "#2196f3, #64b5f6"
                        })`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <School sx={{ fontSize: 48, color: "white" }} />
                    </Box>
                    {isEnrolled(course._id) && (
                      <Chip
                        icon={<CheckCircle />}
                        label="Enrolled"
                        color="success"
                        size="small"
                        sx={{ position: "absolute", top: 8, right: 8 }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {course.description}
                    </Typography>
                  </CardContent>

                  <Divider />

                  <CardActions sx={{ p: 2, justifyContent: "space-between" }}>
                    <Button
                      variant={isEnrolled(course._id) ? "outlined" : "contained"}
                      onClick={() => handleEnroll(course._id)}
                      disabled={isEnrolled(course._id)}
                      startIcon={isEnrolled(course._id) ? <Bookmark /> : <BookmarkBorder />}
                      sx={{ borderRadius: 2 }}
                    >
                      {isEnrolled(course._id) ? "Enrolled" : "Enroll Now"}
                    </Button>
                    <IconButton>
                      <BookmarkBorder />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* My Enrolled Courses Section */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Dashboard sx={{ mr: 2, color: "success.main" }} />
            <Typography variant="h4" component="h2" fontWeight="bold">
              My Learning Journey
            </Typography>
            <Chip label={`${enrolled.length} enrolled`} color="success" sx={{ ml: 2 }} />
          </Box>

          {enrolled.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center" }}>
              <School sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No courses enrolled yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start your learning journey by enrolling in courses above!
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
  {enrolled.map((course) => (
    <Grid item xs={12} sm={6} lg={4} key={course._id}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid",
          borderColor: "success.main",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 3,
          },
        }}
      >
        <Box
          sx={{
            height: 80, // Reduced height
            background: "linear-gradient(135deg, #4caf50, #81c784)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <School sx={{ fontSize: 36, color: "white" }} /> {/* Reduced icon size */}
          <Chip
            icon={<CheckCircle />}
            label="Active"
            color="success"
            size="small"
            sx={{ position: "absolute", top: 4, right: 4 }} // Adjusted position
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 2 }}> {/* Reduced padding */}
          <Typography variant="h6" component="h3" gutterBottom sx={{ fontSize: '1rem' }}> {/* Reduced font size */}
            {course.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: '0.75rem' }}> {/* Reduced font size */}
            {course.description}
          </Typography>
          <Box sx={{ mt: 1 }}> {/* Reduced margin */}
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.75rem' }}>
              Progress: 75%
            </Typography>
            <LinearProgress variant="determinate" value={75} sx={{ borderRadius: 1, height: 6 }} />
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ p: 1 }}> {/* Reduced padding */}
          <Button variant="contained" fullWidth sx={{ borderRadius: 2, fontSize: '0.8rem' }}> {/* Reduced font size */}
            Continue Learning
          </Button>
        </CardActions>
      </Card>
    </Grid>
  ))}
</Grid>

          )}
        </Box>
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
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

export default StudentDashboard;
