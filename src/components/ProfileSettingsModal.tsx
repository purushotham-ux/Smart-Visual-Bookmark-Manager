import React, { useState } from 'react';
import { User } from '../types/User';
import { useAuth } from '../contexts/AuthContext';
import Icon from './ui/Icon';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth, storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ProfileSettingsModalProps {
  user: User;
  onClose: () => void;
}

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ user, onClose }) => {
  const { currentUser, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageMessage, setImageMessage] = useState('');
  const [profileMessage, setProfileMessage] = useState('');

  // Regenerate avatar
  const handleRegenerateAvatar = () => {
    setImageFile(null);
    const newAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&timestamp=${Date.now()}`;
    setPhotoURL(newAvatar);
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setPhotoURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Save only the profile image
  const handleSaveProfileImage = async () => {
    setIsLoading(true);
    setError('');
    setImageMessage('');
    try {
      let finalPhotoURL = photoURL;
      if (imageFile && auth.currentUser) {
        const imageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        console.log('Uploading image to Firebase Storage...', imageFile);
        await uploadBytes(imageRef, imageFile);
        finalPhotoURL = await getDownloadURL(imageRef);
        console.log('Image uploaded. Download URL:', finalPhotoURL);
      }
      if (auth.currentUser) {
        console.log('Updating user profile with photoURL:', finalPhotoURL);
        await updateProfile(auth.currentUser, { photoURL: finalPhotoURL });
        await refreshUser();
        setPhotoURL(auth.currentUser.photoURL || finalPhotoURL);
        setImageMessage('Profile image updated successfully!');
        setImageFile(null);
      } else {
        setError('No user is signed in.');
      }
    } catch (err: any) {
      console.error('Failed to update profile image:', err);
      setError('Failed to update profile image: ' + (err.message || err.toString()));
    } finally {
      setIsLoading(false);
    }
  };

  // Save only the display name
  const handleSaveDisplayName = async () => {
    setIsLoading(true);
    setError('');
    setProfileMessage('');
    try {
      if (auth.currentUser) {
        console.log('Updating user profile with displayName:', displayName);
        await updateProfile(auth.currentUser, { displayName });
        await refreshUser();
        setDisplayName(auth.currentUser.displayName || displayName);
        setProfileMessage('Display name updated successfully!');
      } else {
        setError('No user is signed in.');
      }
    } catch (err: any) {
      console.error('Failed to update display name:', err);
      setError('Failed to update display name: ' + (err.message || err.toString()));
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      setIsLoading(false);
      return;
    }
    try {
      if (!auth.currentUser || !auth.currentUser.email) throw new Error('No user');
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        oldPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setMessage('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to change password. Please check your old password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white">
          <Icon name="close" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Profile Settings</h2>
        <div className="flex flex-col items-center mb-6">
          <img
            src={photoURL || 'https://via.placeholder.com/80'}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-primary-500 mb-2 object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-2"
          />
          <button onClick={handleRegenerateAvatar} className="text-xs text-primary-500 hover:underline mb-2">Regenerate Avatar</button>
          <button
            onClick={handleSaveProfileImage}
            className="w-full py-2 mb-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium"
            disabled={isLoading}
          >
            Save Profile Image
          </button>
          {imageMessage && <div className="mt-2 text-green-600 text-center">{imageMessage}</div>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <button
          onClick={handleSaveDisplayName}
          className="w-full py-2 mb-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium"
          disabled={isLoading}
        >
          Save Display Name
        </button>
        {profileMessage && <div className="mt-2 text-green-600 text-center">{profileMessage}</div>}
        <hr className="my-4" />
        <h3 className="text-lg font-semibold mb-2">Change Password</h3>
        <div className="mb-2">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white mb-2"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white mb-2"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <button
          onClick={handleChangePassword}
          className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
          disabled={isLoading}
        >
          Change Password
        </button>
        {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default ProfileSettingsModal; 