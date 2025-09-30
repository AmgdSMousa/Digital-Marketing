import React, { useState } from 'react';
import { User } from '../types';
import { Card } from '../components/Card';
import UserModal from '../components/UserModal';

interface UserManagementViewProps {
  users: User[];
  currentUser: User;
  onSaveUsers: (users: User[]) => void;
}

const UserManagementView: React.FC<UserManagementViewProps> = ({ users, currentUser, onSaveUsers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      onSaveUsers(updatedUsers);
    }
  };

  const handleSaveUser = (userToSave: Omit<User, 'id'> & { id?: string }) => {
    let updatedUsers;
    if (userToSave.id) { // Edit
      updatedUsers = users.map(u => u.id === userToSave.id ? { ...u, ...userToSave, password: userToSave.password || u.password } : u);
    } else { // Add
      const newUser = { ...userToSave, id: Date.now().toString() } as User;
      updatedUsers = [newUser, ...users];
    }
    onSaveUsers(updatedUsers);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add User
        </button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Admin' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>{user.role}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button onClick={() => handleEditUser(user)} className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400">Edit</button>
                    {user.id !== currentUser.id && (
                       <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {isModalOpen && (
        <UserModal
          user={editingUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UserManagementView;
