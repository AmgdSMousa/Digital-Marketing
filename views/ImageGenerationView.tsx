import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { Loader } from '../components/Loader';
import { Card } from '../components/Card';
import { View, GenerationResult } from '../types';
import { ErrorDisplay } from '../components/ErrorDisplay';

interface Props {
  addToHistory: (view: View, input: any, output: GenerationResult) => void;
}

const MIN_PROMPT_LENGTH = 10;

const ImageGenerationView: React.FC<Props> = ({ addToHistory }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPromptValid = prompt.trim().length >= MIN_PROMPT_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPromptValid) {
      setError(`Please enter a descriptive prompt of at least ${MIN_PROMPT_LENGTH} characters.`);
      return;
    }

    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const result = await generateImage(prompt);
      if (!result.startsWith('An error occurred')) {
        setImage(result);
        addToHistory(View.ImageGeneration, { prompt }, result);
      } else {
        setError(result);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${image}`;
    // Sanitize the prompt to create a filesystem-friendly filename
    const fileName = prompt.slice(0, 30).replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').trim() || 'generated_image';
    link.download = `${fileName}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image Prompt
            </label>
            <div className="mt-1">
              <textarea
                name="prompt"
                id="prompt"
                rows={4}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value)
                  if (error) setError(null);
                }}
                className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., A photorealistic image of a cat wearing a tiny wizard hat"
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Must be at least {MIN_PROMPT_LENGTH} characters.</span>
                <span className={isPromptValid ? 'text-green-500' : 'text-red-500'}>
                    {prompt.trim().length}
                </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !isPromptValid}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
        </form>
      </Card>

      {loading && <Loader />}
      <ErrorDisplay error={error} />
      
      {image && (
        <Card>
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">Generated Image</h3>
          <div className="flex justify-center">
            <img 
              src={`data:image/jpeg;base64,${image}`} 
              alt={prompt}
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </div>
           <div className="mt-4 flex justify-center">
             <button
              onClick={handleDownload}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Image
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImageGenerationView;