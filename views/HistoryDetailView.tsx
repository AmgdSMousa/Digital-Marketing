import React from 'react';
import { HistoryItem, View, EmailCampaign, AdCopy } from '../types';
import { Card } from '../components/Card';
import { CopyButton } from '../components/CopyButton';

interface Props {
  item: HistoryItem;
}

const renderOutput = (item: HistoryItem) => {
  switch (item.view) {
    case View.ContentIdeas:
      return (
        <div>
          <h4 className="font-semibold">Generated Ideas:</h4>
          <ul className="mt-2 space-y-2">
            {(item.output as string[]).map((idea, index) => (
              <li key={index} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md flex justify-between items-center">
                <span>{idea}</span>
                <CopyButton textToCopy={idea} />
              </li>
            ))}
          </ul>
        </div>
      );
    case View.SocialMediaPost:
      return (
        <div>
          <h4 className="font-semibold">Generated Post:</h4>
          <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-md relative">
            <div className="absolute top-2 right-2">
                <CopyButton textToCopy={item.output as string} />
            </div>
            <p className="whitespace-pre-wrap">{item.output as string}</p>
          </div>
        </div>
      );
    case View.EmailCampaign:
      const campaign = item.output as EmailCampaign;
      return (
        <div className="space-y-3">
          <h4 className="font-semibold">Generated Email:</h4>
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p><span className="font-medium">Subject:</span> {campaign.subject}</p>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="font-medium">Body:</p>
            <p className="whitespace-pre-wrap mt-1">{campaign.body}</p>
          </div>
        </div>
      );
    case View.AdCopy:
      const adCopy = item.output as AdCopy;
      return (
        <div className="space-y-3">
          <h4 className="font-semibold">Generated Ad Copy:</h4>
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p><span className="font-medium">Headline:</span> {adCopy.headline}</p>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p><span className="font-medium">Description:</span> {adCopy.description}</p>
          </div>
        </div>
      );
    case View.ImageGeneration:
      const imageSrc = `data:image/jpeg;base64,${item.output as string}`;
      const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageSrc;
        // Use the original prompt for a more descriptive filename
        const prompt = item.input.prompt || '';
        const fileName = prompt.slice(0, 30).replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').trim() || 'history_image';
        link.download = `${fileName}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      return (
        <div>
          <h4 className="font-semibold">Generated Image:</h4>
          <div className="mt-2 flex justify-center">
             <img src={imageSrc} alt="Generated from history" className="rounded-lg shadow-lg max-w-full h-auto" />
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
        </div>
      );
    default:
      return <p>Cannot display this history item type.</p>;
  }
};

const HistoryDetailView: React.FC<Props> = ({ item }) => {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-medium">Generation Details</h3>
        <p className="text-sm text-gray-500">{item.timestamp}</p>
      </Card>

      <Card>
        <h4 className="font-semibold mb-2">Inputs</h4>
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
            <pre><code>{JSON.stringify(item.input, null, 2)}</code></pre>
        </div>
      </Card>
      
      <Card>
        {renderOutput(item)}
      </Card>
    </div>
  );
};

export default HistoryDetailView;