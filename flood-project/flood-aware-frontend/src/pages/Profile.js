import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { updateUser, getUser,  } from '../api/usersApi';
import { unSubscribeUser, checkSubscription } from '../api/subscribeApi';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [alertStatus, setAlertStatus] = useState(false);
  const userId = localStorage.getItem('userId');

    // Fetch user profile

  const fetchUserProfile = async () => {
    try {
      const response = await getUser(userId)
      console.log(response, "profile response")
     
      setUser(response);
      setFormData({
        name: response.name || '',
        email: response.email || '',
        phone: response.phoneNumber || '',
      });


      if (response.email) {
        await fetchAlertStatus(response.email);
      } else {
        console.error('Email not found in profile response');
      }
      
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  
   // Check alert subscription status
   const fetchAlertStatus = async (email) => {
    try {
      const response = await checkSubscription(email);
      console.log(response, "fetch alert status")
      setAlertStatus(response.success);
    } catch (error) {
      console.error('Error checking alert subscription:', error);
    }
  };

  useEffect(() => {
  
    fetchUserProfile();
   
  }, [userId]);

  const handleEdit = () => setEditing(true);

  const handleSave = async () => {
    try {
      const payload = {
        email: formData.email,
        fullName: formData.name, 
        phoneNumber: formData.phone, 
       
      };
      const {user} = await updateUser(userId, payload);
      console.log(user, "@@ user")
      setUser(user);
      await fetchUserProfile()
      setEditing(false);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      
    }
  };

  const handleUnsubscribe = async () => {
    try {
      if(!user.email){
        console.log('No email available for subscribing')
        return;
      }
      console.log(user.email, "user email")
       await unSubscribeUser(user.email);
      setAlertStatus(false);
      alert('You have successfully unsubscribed from flood alerts.');
    } catch (error) {
      console.error('Error unsubscribing from alerts:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Greeting Message */}
      <h2 className="text-xl font-semibold text-center mb-4">
        Welcome back, {user.name || 'Valued User'}! 🌟
      </h2>

      
      <div className="space-y-4">
        {/* User Info */}
        <div>
          <label className="block text-gray-700">Name</label>
          {editing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          ) : (
            <p className="text-gray-800">{user.name || 'N/A'}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          {editing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          ) : (
            <p className="text-gray-800">{user.email}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700">Phone</label>
          {editing ? (
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          ) : (
            <p className="text-gray-800">{user.phoneNumber
               || 'N/A'}</p>
          )}
        </div>

        {/* Actions */}
        {editing ? (
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Edit Profile
          </button>
        )}

        {/* Unsubscribe from Alerts */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Flood Alert Subscription</h2>
          {alertStatus ? (
            <div className="flex items-center justify-between">
              <p className="text-gray-800">You are subscribed to flood alerts.</p>
              <button
                onClick={handleUnsubscribe}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Unsubscribe
              </button>
            </div>
          ) : (
            <p className="text-gray-600">You are not subscribed to any alerts.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
