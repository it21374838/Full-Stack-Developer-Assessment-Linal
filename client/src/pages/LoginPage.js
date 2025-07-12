"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
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
  Divider,
} from "@mui/material"
import {
  Login,
  Visibility,
  VisibilityOff,
  School,
  Lock,
  AccountCircle,
  Dashboard,
  Person,
  ArrowForward,
} from "@mui/icons-material"

function LoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!form.username.trim() || !form.password.trim()) {
      showSnackbar("Please fill in all fields", "error")
      return
    }

    setLoading(true)
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)
      localStorage.setItem("userName", res.data.username || form.username)

      showSnackbar("Login successful! Redirecting...", "success")

      setTimeout(() => {
        if (res.data.role === "instructor") {
          navigate("/instructor")
        } else {
          navigate("/dashboard")
        }
      }, 1500)
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Invalid credentials", "error")
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

  const navigateToRegister = () => {
    navigate("/register")
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
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            right: "15%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            animation: "float 4s ease-in-out infinite",
          }}
        />

        <Container component="main" maxWidth="lg">
          <Grid container spacing={4} alignItems="center" sx={{ minHeight: "80vh" }}>
            {/* Left Side - Welcome Back */}
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
                    Welcome Back! 👋
                  </Typography>

                  <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                    Continue your learning journey with us.
                  </Typography>

                  {/* Quick Access Cards */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          textAlign: "center",
                        }}
                      >
                        <Dashboard sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                          Student Portal
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Access courses & track progress
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          textAlign: "center",
                        }}
                      >
                        <Person sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                          Instructor Portal
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Manage courses & students
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            </Grid>

            {/* Right Side - Login Form */}
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
                      <Login sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Typography variant="h5" component="h1" fontWeight="bold">
                      Sign In
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                      Access your learning dashboard
                    </Typography>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Box component="form" onSubmit={handleLogin}>
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
                        sx={{ mb: 3 }}
                      />

                      {/* Forgot Password Link */}
                      <Box sx={{ textAlign: "right", mb: 2 }}>
                        <Link
                          component="button"
                          variant="body2"
                          sx={{
                            textDecoration: "none",
                            color: "primary.main",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Forgot password?
                        </Link>
                      </Box>

                      {/* Login Button */}
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        endIcon={<ArrowForward />}
                        sx={{
                          mt: 1,
                          mb: 3,
                          py: 1.5,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          "&:hover": {
                            background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                          },
                        }}
                      >
                        {loading ? "Signing In..." : "Sign In"}
                      </Button>

                      <Divider sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          OR
                        </Typography>
                      </Divider>

                      {/* Register Button */}
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={navigateToRegister}
                        sx={{
                          py: 1.5,
                          borderColor: "primary.main",
                          color: "primary.main",
                          fontWeight: 600,
                          "&:hover": {
                            borderColor: "primary.dark",
                            backgroundColor: "primary.main",
                            color: "white",
                          },
                        }}
                      >
                        Create New Account
                      </Button>

                      {/* Demo Credentials
                      <Box
                        sx={{
                          mt: 3,
                          p: 2,
                          borderRadius: 1,
                          bgcolor: "grey.50",
                          border: "1px solid",
                          borderColor: "grey.200",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="bold">
                          Demo Credentials:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Student: demo_student / password123
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Instructor: demo_instructor / password123
                        </Typography>
                      </Box> */}
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

export default LoginPage;
