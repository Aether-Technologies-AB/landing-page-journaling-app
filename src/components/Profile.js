import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { updateProfile, updateEmail, updatePassword, sendEmailVerification } from 'firebase/auth';
import './Auth.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useFirebase();
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setError('');
    setSuccessMessage('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const updates = [];

      // Update display name if changed
      if (formData.displayName !== user.displayName) {
        updates.push(updateProfile(user, {
          displayName: formData.displayName
        }));
      }

      // Update email if changed
      if (formData.email !== user.email) {
        updates.push(updateEmail(user, formData.email));
      }

      // Update password if provided
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmNewPassword) {
          throw new Error('New passwords do not match');
        }
        updates.push(updatePassword(user, formData.newPassword));
      }

      await Promise.all(updates);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }));
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await sendEmailVerification(user);
      setSuccessMessage('Verification email sent! Check your inbox.');
    } catch (error) {
      console.error('Email verification error:', error);
      setError(error.message || 'Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="auth-section">
      <form className="auth-form" onSubmit={handleUpdateProfile}>
        <h2>Profile Settings</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          {!user.emailVerified && (
            <button
              type="button"
              onClick={handleSendVerificationEmail}
              className="verify-email-button"
              disabled={isLoading}
            >
              Verify Email
            </button>
          )}
        </div>

        <div className="password-section">
          <h3>Change Password</h3>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
