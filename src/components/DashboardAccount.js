import React, { useState, useEffect } from 'react';
import './DashboardAccount.css';
import {buildPath} from './buildPath';

function DashboardAccount() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve the user ID from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user_data'));
        console.log(storedUser);
        if (!storedUser || !storedUser._id) {
          setError('User not logged in. Redirecting to login...');
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
          return;
        }

        // Make the API call to fetch user data
        const response = await fetch(buildPath(`api/user/${storedUser._id}`), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();

        if (response.ok) {
          setUser(result);
        } else {
          setError(result.error || 'Failed to fetch user details.');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('An error occurred while fetching user details.');
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="dashboardAccountContainer">
      <h1 className="dashboardTitle">Account Information</h1>
      {user ? (
        <div className="accountDetails">
          <div className="detailItem">
            <label className="detailLabel">Full Name:</label>
            <span className="detailValue">{user.name}</span>
          </div>
          <div className="detailItem">
            <label className="detailLabel">Email:</label>
            <span className="detailValue">{user.email}</span>
          </div>
          <div className="detailItem">
            <label className="detailLabel">Password:</label>
            <span className="detailValue">********</span>
          </div>
          <div className="detailItem">
            <label className="detailLabel">Phone Number:</label>
            <span className="detailValue">{user.phone || 'N/A'}</span>
          </div>
        </div>
      ) : (
        <p>Loading your account details...</p>
      )}
    </div>
  );
}

export default DashboardAccount;
