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
import { View, HistoryItem, GenerationResult } from './types';
import { Card } from './components/Card';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.ContentIdeas);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('generationHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
    }
  }, []);

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
        localStorage.setItem('generationHistory', JSON.stringify(newHistory));
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
  
  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all generation history? This action cannot be undone.')) {
      saveHistory([]);
    }
  };

  const handleSetView = (view: View) => {
    setSelectedHistoryItem(null); // Clear history item selection when changing main view
    setCurrentView(view);
  };

  const handleViewHistoryItem = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
    setCurrentView(View.History); // Switch to a mode where detail is shown
  }
  
  const renderHistoryList = () => (
    <Card>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Generation History</h2>
              {history.length > 0 && (
                  <button
                      onClick={clearHistory}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                      Clear History
                  </button>
              )}
          </div>
        {history.length > 0 ? (
          <ul className="space-y-4">
            {history.map(item => (
              <li key={item.id} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition" onClick={() => handleViewHistoryItem(item)}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400">{item.view}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.timestamp}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No generation history yet.</p>
          </div>
        )}
      </div>
    </Card>
  );

  const renderView = () => {
    if (currentView === View.History && selectedHistoryItem) {
      return <HistoryDetailView item={selectedHistoryItem} />;
    }
    
    switch (currentView) {
      case View.ContentIdeas:
        return <ContentIdeasView addToHistory={addToHistory} />;
      case View.SocialMediaPost:
        return <SocialMediaPostView addToHistory={addToHistory} />;
      case View.EmailCampaign:
        return <EmailCampaignView addToHistory={addToHistory} />;
      case View.AdCopy:
        return <AdCopyView addToHistory={addToHistory} />;
      case View.ImageGeneration:
        return <ImageGenerationView addToHistory={addToHistory} />;
      case View.History:
        return renderHistoryList();
      case View.Clients:
        return <ClientsView />;
      case View.Analytics:
        return <AnalyticsDashboardView />;
      case View.Settings:
        return <SettingsView />;
      default:
        return <ContentIdeasView addToHistory={addToHistory} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <Sidebar currentView={currentView} setView={handleSetView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col w-0">
        <Header currentView={selectedHistoryItem ? `History > ${selectedHistoryItem.view}` : currentView} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
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
