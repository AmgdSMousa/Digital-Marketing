import React from 'react';
import { User } from '../types';

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id'> & { id?: string }) => void;
}

export const UserModal: React.FC<UserModalProps> = ({ user, isOpen, onClose, onSave }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            {user ? 'Edit User' : 'Add New User'}
          </h3>
        </div>
        <div className="p-6">
             <p className="text-center text-gray-600 dark:text-gray-400">
                User management is not implemented in this demonstration.
            </p>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
