import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ContentIdeasView from './views/ContentIdeasView';
import SocialMediaPostView from './views/SocialMediaPostView';
import EmailCampaignView from './views/EmailCampaignView';
import AdCopyView from './views/AdCopyView';
import ImageGenerationView from './views/ImageGenerationView';
import HistoryDetailView from './views/HistoryDetailView';
import ClientsView from './views/ClientsView';
import AnalyticsDashboardView from './views/AnalyticsDashboardView';
import SettingsView from './views/SettingsView';
import LoginView from './views/LoginView';
import UserManagementView from './views/UserManagementView';
import { View, HistoryItem, GenerationResult, User } from './types';
import { Card } from './components/Card';
import { LOCAL_STORAGE_KEYS, INITIAL_USERS, ADMIN_ONLY_VIEWS } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentView, setCurrentView] = useState<View>(View.ContentIdeas);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize users and session
  useEffect(() => {
    // Initialize user database
    try {
      const storedUsers = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        // Seed initial users if none exist
        const usersWithHashedPasswords = INITIAL_USERS.map(u => ({ ...u, password: u.password })); // In a real app, hash passwords
        localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(usersWithHashedPasswords));
        setUsers(usersWithHashedPasswords);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }

    // Check for active session
    try {
      const session = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSION);
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    }
  }, []);
  
  // Load generation history
  useEffect(() => {
    if (!currentUser) return; // Only load history if logged in
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEYS.HISTORY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
    }
  }, [currentUser]);

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
    } catch (error) {
        console.error("Failed to save history to localStorage:", error);
    }
  };

  const addToHistory = (view: View, input: any, output: GenerationResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      view,
      input,
      output,
      timestamp: new Date().toLocaleString(),
    };
    saveHistory([newItem, ...history]);
  };

  const handleLogin = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password); // In real app, compare hashed passwords
    if (user) {
      const sessionUser = { id: user.id, username: user.username, role: user.role };
      setCurrentUser(sessionUser);
      localStorage.setItem(LOCAL_STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
      setCurrentView(View.ContentIdeas); // Default view after login
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.SESSION);
  };

  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
  };
  
  const handleSetView = (view: View) => {
    setSelectedHistoryItem(null); 
    setCurrentView(view);
  };

  const handleViewHistoryItem = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
    setCurrentView(View.History); 
  }
  
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <LoginView onLogin={handleLogin} />
      </div>
    );
  }

  // Role-based access check
  if (currentUser.role !== 'Admin' && ADMIN_ONLY_VIEWS.includes(currentView)) {
      setCurrentView(View.ContentIdeas); // Redirect non-admins from restricted areas
  }
  
  const renderView = () => {
    if (currentView === View.History && selectedHistoryItem) {
      return <HistoryDetailView item={selectedHistoryItem} />;
    }
    
    switch (currentView) {
      case View.ContentIdeas: return <ContentIdeasView addToHistory={addToHistory} />;
      case View.SocialMediaPost: return <SocialMediaPostView addToHistory={addToHistory} />;
      case View.EmailCampaign: return <EmailCampaignView addToHistory={addToHistory} />;
      case View.AdCopy: return <AdCopyView addToHistory={addToHistory} />;
      case View.ImageGeneration: return <ImageGenerationView addToHistory={addToHistory} />;
      case View.Clients: return currentUser.role === 'Admin' ? <ClientsView /> : null;
      case View.Analytics: return currentUser.role === 'Admin' ? <AnalyticsDashboardView /> : null;
      case View.Settings: return currentUser.role === 'Admin' ? <SettingsView /> : null;
      case View.UserManagement: return currentUser.role === 'Admin' ? <UserManagementView users={users} currentUser={currentUser} onSaveUsers={saveUsers} /> : null;
      default: return <ContentIdeasView addToHistory={addToHistory} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <Sidebar 
        currentView={currentView} 
        setView={handleSetView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        user={currentUser}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col w-0">
        <Header 
          currentView={selectedHistoryItem ? `History > ${selectedHistoryItem.view}` : currentView} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          user={currentUser}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
