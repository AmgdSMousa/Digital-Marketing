import React from 'react';
import { Card } from '../components/Card';

const LoginView: React.FC = () => {
  return (
    <Card>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Login</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          User authentication is not implemented in this demonstration.
        </p>
      </div>
    </Card>
  );
};

export default LoginView;
