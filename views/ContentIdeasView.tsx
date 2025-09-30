import React, { useState } from 'react';
import { generateContentIdeas } from '../services/geminiService';
import { Loader } from '../components/Loader';
import { Card } from '../components/Card';
import { CopyButton } from '../components/CopyButton';
import { View, GenerationResult } from '../types';
import { ErrorDisplay } from '../components/ErrorDisplay';

interface Props {
  addToHistory: (view: View, input: any, output: GenerationResult) => void;
}

const ContentIdeasView: React.FC<Props> = ({ addToHistory }) => {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }

    setLoading(true);
    setError(null);
    setIdeas([]);

    try {
      const result = await generateContentIdeas(topic);
      if (!(result.length === 1 && result[0].startsWith('An error occurred'))) {
        setIdeas(result);
        addToHistory(View.ContentIdeas, { topic }, result);
      } else {
        setError(result[0]);
      }
    } catch (err) {
      setError('An error occurred while generating ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Topic
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="topic"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., sustainable fashion, AI in marketing"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Ideas'}
          </button>
        </form>
      </Card>

      {loading && <Loader />}
      <ErrorDisplay error={error} />
      
      {ideas.length > 0 && (
        <Card>
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Generated Content Ideas</h3>
          <ul className="mt-4 space-y-3">
            {ideas.map((idea, index) => (
              <li key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md flex justify-between items-center">
                <span className="flex-1">{idea}</span>
                <CopyButton textToCopy={idea} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default ContentIdeasView;