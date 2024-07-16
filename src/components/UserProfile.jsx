import React, { useState, useEffect } from 'react';
import { db, doc, setDoc, getDoc, deleteDoc } from '../Firebase'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase'; 
import '../css/UserProfile.css';

const UserProfile = ({ profile, setProfile, formVisible, setFormVisible }) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data());
            setFormVisible(false);
          } else {
            setFormVisible(true);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
        setFormVisible(false);
      } catch (error) {
        console.error("Error saving profile data:", error);
      }
    } else {
      console.error("User not authenticated");
    }
  };

  const handleResetProfile = async () => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid));
        setProfile({
          weight: '',
          age: '',
          activityLevel: 'Moderate',
          gender: 'Female'
        });
        setFormVisible(true);
      } catch (error) {
        console.error("Error deleting profile data:", error);
      }
    } else {
      console.error("User not authenticated");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="user-profile">
      {formVisible ? (
        <form onSubmit={handleSubmit}>
          <h2>User Profile</h2>
          <div>
            <label>Weight (kg):</label>
            <input
              type="number"
              name="weight"
              value={profile.weight}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Activity Level:</label>
            <select
              name="activityLevel"
              value={profile.activityLevel}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label>Gender:</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
          <button type="submit">Save Profile</button>
        </form>
      ) : (
        <div>
          <h2>User Profile</h2>
          <p>Weight: {profile.weight} kg</p>
          <p>Age: {profile.age}</p>
          <p>Activity Level: {profile.activityLevel}</p>
          <p>Gender: {profile.gender}</p>
          <button onClick={handleResetProfile} style={{ marginTop: '10px' }}>Reset Profile</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
