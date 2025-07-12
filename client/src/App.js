import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import Dashboard from './pages/Dashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import StudentDashboard from './pages/StudentDashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        
      </Routes>
    </Router>
  );
}
export default App;
