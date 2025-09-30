import React, { useState } from 'react';
import { generateEmailCampaign } from '../services/geminiService';
import { Loader } from '../components/Loader';
import { Card } from '../components/Card';
import { CopyButton } from '../components/CopyButton';
import { EmailCampaign, View, GenerationResult } from '../types';
import { ErrorDisplay } from '../components/ErrorDisplay';

interface Props {
  addToHistory: (view: View, input: any, output: GenerationResult) => void;
}

const EmailCampaignView: React.FC<Props> = ({ addToHistory }) => {
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [campaign, setCampaign] = useState<EmailCampaign | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.trim() || !audience.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setCampaign(null);

    try {
      const result = await generateEmailCampaign(product, audience);
      if (result.subject !== "Error") {
        setCampaign(result);
        addToHistory(View.EmailCampaign, { product, audience }, result);
      } else {
        setError(result.body);
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
            <label htmlFor="product" className="block text-sm font-medium">Product/Service Description</label>
            <textarea
              id="product"
              rows={3}
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., A new AI-powered project management tool..."
            />
          </div>
          <div>
            <label htmlFor="audience" className="block text-sm font-medium">Target Audience</label>
            <input
              type="text"
              id="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., startup founders, marketing teams"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {loading ? 'Generating...' : 'Generate Email'}
          </button>
        </form>
      </Card>
      
      {loading && <Loader />}
      <ErrorDisplay error={error} />
      
      {campaign && (
        <Card>
          <h3 className="text-lg font-medium">Generated Email Campaign</h3>
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex justify-between items-center">
                <p className="font-semibold">Subject: {campaign.subject}</p>
                <CopyButton textToCopy={campaign.subject} />
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold">Body</p>
                <CopyButton textToCopy={campaign.body} />
              </div>
              <p className="whitespace-pre-wrap">{campaign.body}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EmailCampaignView;