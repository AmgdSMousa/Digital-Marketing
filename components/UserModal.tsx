import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'password'> & { id?: string; password?: string }) => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'User' as 'Admin' | 'User'
  });
  const [error, setError] = useState('');

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        password: '',
        role: user.role
      });
    } else {
      setFormData({ username: '', password: '', role: 'User' });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!isEditing && !formData.password.trim()) {
      setError('Password is required for new users.');
      return;
    }
    setError('');
    
    const userToSave: Omit<User, 'id' | 'password'> & { id?: string; password?: string } = {
        id: user?.id,
        username: formData.username,
        role: formData.role,
    };

    if (formData.password) {
        userToSave.password = formData.password;
    }
    
    onSave(userToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            {isEditing ? 'Edit User' : 'Add New User'}
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <label htmlFor="username" className="block text-sm font-medium">Username</label>
              <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {isEditing && <p className="mt-1 text-xs text-gray-500">Leave blank to keep the current password.</p>}
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium">Role</label>
              <select name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
                <option>User</option>
                <option>Admin</option>
              </select>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
