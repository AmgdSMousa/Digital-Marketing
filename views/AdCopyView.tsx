import React, { useState } from 'react';
import { generateAdCopy } from '../services/geminiService';
import { Loader } from '../components/Loader';
import { Card } from '../components/Card';
import { CopyButton } from '../components/CopyButton';
import { AdCopy, View, GenerationResult } from '../types';
import { ErrorDisplay } from '../components/ErrorDisplay';

interface Props {
  addToHistory: (view: View, input: any, output: GenerationResult) => void;
}

const AdCopyView: React.FC<Props> = ({ addToHistory }) => {
  const [product, setProduct] = useState('');
  const [platform, setPlatform] = useState('Google Ads');
  const [adCopy, setAdCopy] = useState<AdCopy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.trim()) {
      setError('Please describe the product/service.');
      return;
    }

    setLoading(true);
    setError(null);
    setAdCopy(null);

    try {
      const result = await generateAdCopy(product, platform);
      if (result.headline !== 'Error') {
        setAdCopy(result);
        addToHistory(View.AdCopy, { product, platform }, result);
      } else {
        setError(result.description);
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
            <label htmlFor="platform" className="block text-sm font-medium">Ad Platform</label>
            <select id="platform" value={platform} onChange={e => setPlatform(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
              <option>Google Ads</option>
              <option>Facebook Ads</option>
              <option>LinkedIn Ads</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {loading ? 'Generating...' : 'Generate Ad Copy'}
          </button>
        </form>
      </Card>
      
      {loading && <Loader />}
      <ErrorDisplay error={error} />
      
      {adCopy && (
        <Card>
          <h3 className="text-lg font-medium">Generated Ad Copy</h3>
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex justify-between items-center">
                    <p><span className="font-semibold">Headline:</span> {adCopy.headline}</p>
                    <CopyButton textToCopy={adCopy.headline} />
                </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex justify-between items-start">
                    <p><span className="font-semibold">Description:</span> {adCopy.description}</p>
                    <CopyButton textToCopy={adCopy.description} />
                </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdCopyView;