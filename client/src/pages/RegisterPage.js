"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  CssBaseline,
  Card,
  CardContent,
  Avatar,
  Grid,
  Link,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
  Fade,
} from "@mui/material"
import { PersonAdd, Visibility, VisibilityOff, School, Person, Lock, AccountCircle } from "@mui/icons-material"

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "student",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.username.trim() || !form.password.trim()) {
      showSnackbar("Please fill in all fields", "error")
      return
    }

    if (form.password.length < 6) {
      showSnackbar("Password must be at least 6 characters", "error")
      return
    }

    setLoading(true)
    try {
      await axios.post("http://localhost:5000/api/auth/register", form)
      showSnackbar("Registration successful! Redirecting to login...", "success")
      setTimeout(() => navigate("/"), 2000)
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Registration failed", "error")
    } finally {
      setLoading(false)
    }
  }

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity })
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <CssBaseline />

      {/* Background */}
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Background Decorative Elements */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />

        <Container component="main" maxWidth="lg">
          <Grid container spacing={4} alignItems="center" sx={{ minHeight: "80vh" }}>
            {/* Left Side - Branding */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box sx={{ color: "white", textAlign: { xs: "center", md: "left" } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: { xs: "center", md: "flex-start" },
                      mb: 3,
                    }}
                  >
                    <School sx={{ fontSize: 48, mr: 2 }} />
                    <Typography variant="h3" component="h1" fontWeight="bold">
                      EduPortal
                    </Typography>
                  </Box>

                  <Typography variant="h4" component="h2" gutterBottom fontWeight="600">
                    Join Our Learning Community
                  </Typography>

                  <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                    Connect with expert instructors and fellow learners worldwide.
                  </Typography>

                  {/* Simple Stats */}
                  <Grid container spacing={3} justifyContent={{ xs: "center", md: "flex-start" }}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" fontWeight="bold">
                          10K+
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Students
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" fontWeight="bold">
                          500+
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Courses
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" fontWeight="bold">
                          4.9★
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Rating
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            </Grid>

            {/* Right Side - Registration Form */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={1500}>
                <Card
                  sx={{
                    maxWidth: 420,
                    mx: "auto",
                    borderRadius: 3,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* Card Header */}
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      p: 3,
                      textAlign: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        mx: "auto",
                        mb: 2,
                        bgcolor: "rgba(255,255,255,0.2)",
                      }}
                    >
                      <PersonAdd sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Typography variant="h5" component="h1" fontWeight="bold">
                      Create Account
                    </Typography>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Box component="form" onSubmit={handleSubmit}>
                      {/* Username Field */}
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircle color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />

                      {/* Password Field */}
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleClickShowPassword} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />

                      {/* Role Selection */}
                      <FormControl fullWidth margin="normal" required sx={{ mb: 3 }}>
                        <InputLabel>Role</InputLabel>
                        <Select
                          value={form.role}
                          label="Role"
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          startAdornment={
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="student">Student</MenuItem>
                          <MenuItem value="instructor">Instructor</MenuItem>
                        </Select>
                      </FormControl>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                          mt: 2,
                          mb: 2,
                          py: 1.5,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          "&:hover": {
                            background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                          },
                        }}
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>

                      {/* Login Link */}
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          Already have an account?{" "}
                          <Link
                            component="button"
                            variant="body2"
                            onClick={() => navigate("/")}
                            sx={{
                              textDecoration: "none",
                              fontWeight: 600,
                              color: "primary.main",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            Sign in
                          </Link>
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

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

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </>
  )
}

export default RegisterPage;
