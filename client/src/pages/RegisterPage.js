import React, { useState } from 'react';
import axios from 'axios';
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
  CssBaseline
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // ✅ correct import

function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'student'
  });

  const navigate = useNavigate(); // ✅ use lowercase variable name

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('Registered successfully');
      navigate('/'); // ✅ redirect to login page
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Role</InputLabel>
            <Select
              value={form.role}
              label="Role"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="instructor">Instructor</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;
