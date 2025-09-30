import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { SmtpSettings } from '../types';

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<SmtpSettings>({
    server: '',
    port: '587',
    username: '',
    password: '',
    fromEmail: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('smtpSettings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Failed to load SMTP settings from localStorage:", error);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('smtpSettings', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error("Failed to save SMTP settings to localStorage:", error);
      alert("An error occurred while saving settings.");
    }
  };
  
  const WarningIcon = () => (
    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );


  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="border-l-4 border-yellow-400 bg-yellow-50 dark:bg-gray-800 dark:border-yellow-500">
        <div className="flex">
          <div className="flex-shrink-0">
            <WarningIcon />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Security Warning</h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-200">
              <p>
                Storing credentials like passwords in browser local storage is insecure. This feature is for demonstration purposes only. In a production environment, email sending should be handled by a secure backend server that manages credentials safely.
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">SMTP Configuration</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure the settings for sending emails. These settings are saved locally in your browser.
        </p>
        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div>
            <label htmlFor="server" className="block text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Server</label>
            <input type="text" name="server" id="server" value={settings.server} onChange={handleChange} placeholder="smtp.example.com" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label htmlFor="port" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Port</label>
            <input type="text" name="port" id="port" value={settings.port} onChange={handleChange} placeholder="587" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <div>
            <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">"From" Email</label>
            <input type="email" name="fromEmail" id="fromEmail" value={settings.fromEmail} onChange={handleChange} placeholder="yourname@example.com" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input type="text" name="username" id="username" value={settings.username} onChange={handleChange} placeholder="your-username" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input type="password" name="password" id="password" value={settings.password} onChange={handleChange} placeholder="••••••••" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div className="flex justify-end items-center pt-2">
            {saved && (
                <span className="text-sm text-green-600 dark:text-green-400 mr-4 transition-opacity duration-300">
                    Settings saved successfully!
                </span>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Settings
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SettingsView;
