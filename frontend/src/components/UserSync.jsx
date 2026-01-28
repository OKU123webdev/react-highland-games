import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import axios from 'axios';

// API URL
const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

// UserSync component
function UserSync() {
  const { isAuthenticated, user, isLoading } = useAuth0();
  // SYNC USER TO DATABASE
  useEffect(() => {
    const syncUser = async () => {
      if (isLoading) return; // Wait for Auth0 to finish loading
      
      // check if user authenticated
      if (isAuthenticated && user) {
        try {
          // Check pending registration data
          const pendingReg = localStorage.getItem('pendingRegistration');
          const registrationData = pendingReg ? JSON.parse(pendingReg) : null;

          // prepare user data
          const userData = {
            auth0_id: user.sub,
            firstname: registrationData?.firstname || user.given_name || user.nickname || 'User',
            lastname: registrationData?.lastname || user.family_name || '',
            role: 'participant'
          };

          console.log('Syncing user to database:', userData);

          const response = await axios.post(`${api}/api/users/sync`, userData);
          
          console.log('User synced successfully:', response.data);

          // CREATE PARTICIPANT RECORD IF REGISTRATION DATA EXISTS
          if (registrationData) {
            console.log('Creating participant record...');
            
            await axios.post(`${api}/api/participants/register`, {
              user_id: response.data._id, // Use the MongoDB user _id
              firstname: registrationData.firstname,
              lastname: registrationData.lastname,
              phone_no: registrationData.phone_no || '',
              affiliation: registrationData.affiliation || '',
              is_group: registrationData.is_group || false,
              group_name: registrationData.group_name || '',
              contact_consent: registrationData.contact_consent || false,
              score_consent: registrationData.score_consent || false,
              marketing_consent: registrationData.marketing_consent || false,
              event_id: registrationData.event_id,
              game_id: registrationData.game_id
            });

            console.log('Participant record created successfully');
          }
          
          // ERROER HANDLING
        } catch (error) {
          console.error("Error syncing user:", error);
          console.error("Error details:", error.response?.data);
        }
      }
    };

    syncUser();
  }, [isAuthenticated, user, isLoading]);

  return null;
}

export default UserSync;