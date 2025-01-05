import React, { useState, useEffect } from 'react';
import './DashboardAccount.css';
import { buildPath } from './buildPath';

function DashboardAccount() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user_data'));
        if (!storedUser || !storedUser._id) {
          setError('User not logged in. Redirecting to login...');
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
          return;
        }

        const response = await fetch(buildPath(`api/user/${storedUser._id}`), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();

        if (response.ok) {
          setUser(result);
          setUpdatedUser(result);
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setUpdatedUser(user);
    setIsEditing(false); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(buildPath(`api/user/${user._id}`), {
        method: 'PUT',
        body: JSON.stringify({
          name: updatedUser.name,
          email: user.email,
          phone: updatedUser.phone,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const result = await response.json();
        setUser(result); 
        setIsEditing(false);
        alert('Account details updated successfully.');
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to update account details.');
      }
    } catch (err) {
      console.error('Error updating account details:', err);
      alert('An error occurred while updating your account.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action is irreversible.')) return;

    try {
      const response = await fetch(buildPath(`api/user/${user._id}`), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        alert('Your account has been deleted.');
        localStorage.clear();
        window.location.href = '/login';
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to delete account.');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('An error occurred while deleting your account.');
    }
  };

  const handleResetPassword = () => {
    if (window.confirm('Are you sure you want to reset your password?')) {
      window.location.href = `/reset-password/${user._id}/:token`; 
    }
  };

  return (
    <div className="dashboardAccountContainer">
      <h1 className="dashboardTitle">Account Information</h1>
      {user ? (
        <>
          <div className="accountDetails">
            <div className="detailItem">
              <label className="detailLabel">Full Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={updatedUser.name || ''}
                  onChange={handleInputChange}
                  className="editInput"
                />
              ) : (
                <span className="detailValue">{user.name}</span>
              )}
            </div>
            <div className="detailItem">
              <label className="detailLabel">Email:</label>
              <span className="detailValue">{user.email}</span>
            </div>
            <div className="detailItem">
              <label className="detailLabel">Phone Number:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={updatedUser.phone || ''}
                  onChange={handleInputChange}
                  className="editInput"
                />
              ) : (
                <span className="detailValue">{user.phone || 'N/A'}</span>
              )}
            </div>
          </div>
          <div className="accountActions">
            <button className="btn resetPasswordBtn" onClick={handleResetPassword}>
              Reset Password
            </button>
            {isEditing ? (
              <button className="btn saveBtn" onClick={handleSave}>
                Save
              </button>
            ) : (
              <button className="btn editBtn" onClick={handleEditToggle}>
                Edit
              </button>
            )}
            {isEditing ? (
              <button className="btn deleteBtn" onClick={handleCancelEdit}>
                Cancel
              </button>
            ) : (
              <button className="btn deleteBtn" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            )}
          </div>
        </>
      ) : (
        <p>{error || 'Loading your account details...'}</p>
      )}
    </div>
  );
}

export default DashboardAccount;
