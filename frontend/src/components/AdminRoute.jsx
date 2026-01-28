import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// API URL
const api = import.meta.env.VITE_API_URL || "http://localhost:5000";
// AdminRoute component
function AdminRoute({ children }) {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // CHECK IF USER IS ADMIN
  useEffect(() => {
    // Wait for Auth0 to finish loading
    const checkAdmin = async () => {
      if (isLoading) {
        return; 
      }

      // check user role 
      if (isAuthenticated && user) {
        try {
          const response = await axios.get(`${api}/api/users/role?auth0Id=${user.sub}`);
          setUserRole(response.data.role);
        } catch (error) {
          console.error("Error checking user role:", error);
          setUserRole('participant');
        }
      }
      setLoading(false);
    };

    checkAdmin();
  }, [isAuthenticated, user, isLoading]);

  // RENDERING LOGIC
  if (loading || isLoading) return <div className="text-center p-5">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (userRole !== 'admin') return <div className="container text-center p-5"><h2>Access Denied</h2></div>;

  return children;
}

export default AdminRoute;