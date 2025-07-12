import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <h2>Welcome to Dashboard</h2>
      <p>You are logged in as: <strong>{localStorage.getItem('role')}</strong></p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
