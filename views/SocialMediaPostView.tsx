import React, { useState } from 'react';
import { generateSocialMediaPost } from '../services/geminiService';
import { Loader } from '../components/Loader';
import { Card } from '../components/Card';
import { CopyButton } from '../components/CopyButton';
import { View, GenerationResult } from '../types';
import { ErrorDisplay } from '../components/ErrorDisplay';

interface Props {
  addToHistory: (view: View, input: any, output: GenerationResult) => void;
}

const SocialMediaPostView: React.FC<Props> = ({ addToHistory }) => {
  const [idea, setIdea] = useState('');
  const [platform, setPlatform] = useState('Facebook');
  const [tone, setTone] = useState('Professional');
  const [audience, setAudience] = useState('');
  const [post, setPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) {
      setError('Please enter a topic/idea.');
      return;
    }

    setLoading(true);
    setError(null);
    setPost('');

    try {
      const result = await generateSocialMediaPost(idea, platform, tone, audience);
      if (!result.startsWith('An error occurred')) {
        setPost(result);
        addToHistory(View.SocialMediaPost, { idea, platform, tone, audience }, result);
      } else {
        setError(result);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="idea" className="block text-sm font-medium">Topic/Idea</label>
            <textarea
              id="idea"
              rows={3}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Announcing a new product feature..."
            />
            <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
              {idea.length} characters
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium">Platform</label>
              <select id="platform" value={platform} onChange={e => setPlatform(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
                <option>Facebook</option>
                <option>Twitter</option>
                <option>LinkedIn</option>
                <option>Instagram</option>
              </select>
            </div>
            <div>
              <label htmlFor="tone" className="block text-sm font-medium">Tone</label>
              <select id="tone" value={tone} onChange={e => setTone(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
                <option>Professional</option>
                <option>Casual</option>
                <option>Witty</option>
                <option>Enthusiastic</option>
              </select>
            </div>
          </div>
           <div>
            <label htmlFor="audience" className="block text-sm font-medium">Target Audience (Optional)</label>
            <input
              type="text"
              id="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., small business owners, tech enthusiasts"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {loading ? 'Generating...' : 'Generate Post'}
          </button>
        </form>
      </Card>
      
      {loading && <Loader />}
      <ErrorDisplay error={error} />

      {post && (
        <Card>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Generated Social Media Post</h3>
            <CopyButton textToCopy={post} />
          </div>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md whitespace-pre-wrap">
            {post}
          </div>
          <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-2">
            Character count: {post.length}
            {platform === 'Twitter' && post.length > 280 && (
              <span className="ml-2 font-semibold text-red-500">(Exceeds 280 characters)</span>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SocialMediaPostView;