import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../components/Card';
import { HistoryItem, Client, View } from '../types';

// Simple list of common words to ignore in keyword analysis
const stopWords = new Set(['a', 'an', 'the', 'in', 'on', 'for', 'with', 'of', 'to', 'and', 'is', 'are', 'was', 'were', 'it', 'i', 'you', 'he', 'she', 'they', 'we', 'about', 'as', 'e.g.', 'like']);

const AnalyticsDashboardView: React.FC = () => {
  const [stats, setStats] = useState<{
    totalGenerations: number;
    totalClients: number;
    mostUsedTool: string;
    generationsByTool: { name: string; generations: number }[];
    topKeywords: { name: string; count: number }[];
  }>({
    totalGenerations: 0,
    totalClients: 0,
    mostUsedTool: 'N/A',
    generationsByTool: [],
    topKeywords: [],
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Load data from localStorage
      const historyString = localStorage.getItem('generationHistory');
      const clientsString = localStorage.getItem('clients');
      
      const history: HistoryItem[] = historyString ? JSON.parse(historyString) : [];
      const clients: Client[] = clientsString ? JSON.parse(clientsString) : [];
      
      // --- Calculate stats ---
      const totalGenerations = history.length;
      const totalClients = clients.length;

      // Generations by Tool
      const toolCounts: { [key in View]?: number } = {};
      history.forEach(item => {
        toolCounts[item.view] = (toolCounts[item.view] || 0) + 1;
      });
      const generationsByTool = Object.entries(toolCounts)
        .map(([name, count]) => ({ name, generations: count as number }))
        .sort((a, b) => b.generations - a.generations);
      
      const mostUsedTool = generationsByTool.length > 0 ? generationsByTool[0].name : 'N/A';

      // Top Keywords
      const wordCounts: { [key: string]: number } = {};
      history.forEach(item => {
        // Extract all string values from the input object
        const inputString = JSON.stringify(item.input).toLowerCase();
        // FIX: Explicitly check for null from match() to avoid type inference issues where `word` could be `never`.
        const words = inputString.match(/\b(\w+)\b/g);
        if (words) {
          words.forEach(word => {
            if (word.length > 3 && !stopWords.has(word) && isNaN(parseInt(word))) {
              wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
          });
        }
      });
      const topKeywords = Object.entries(wordCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

      setStats({
        totalGenerations,
        totalClients,
        mostUsedTool,
        generationsByTool,
        topKeywords,
      });

    } catch (error) {
      console.error("Failed to calculate analytics:", error);
    } finally {
        setLoading(false);
    }
  }, []);
  
  if (loading) {
      return <div className="text-center p-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Generations</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.totalGenerations}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.totalClients}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Used Tool</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white truncate">{stats.mostUsedTool}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium">Generations by Tool</h3>
          {stats.generationsByTool.length > 0 ? (
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.generationsByTool} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-25} textAnchor="end" height={50} interval={0} />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    cursor={{fill: 'rgba(128, 128, 128, 0.1)'}}
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.9)',
                      borderColor: 'rgba(55, 65, 81, 1)',
                      color: '#fff',
                      borderRadius: '0.5rem',
                    }}
                   />
                  <Bar dataKey="generations" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="mt-4 text-center text-gray-500 py-16">No generation data available.</p>}
        </Card>
        <Card>
          <h3 className="text-lg font-medium">Top Keywords</h3>
          {stats.topKeywords.length > 0 ? (
            <div className="mt-4 h-80">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topKeywords} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} interval={0} />
                  <Tooltip
                     cursor={{fill: 'rgba(128, 128, 128, 0.1)'}}
                     contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.9)',
                      borderColor: 'rgba(55, 65, 81, 1)',
                      color: '#fff',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="mt-4 text-center text-gray-500 py-16">No keyword data available.</p>}
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboardView;
