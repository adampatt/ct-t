import './App.css';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState<'tracks' | 'signals'>('tracks');

  const { isPending, error, data } = useQuery({
    queryKey: ['signals'],
    queryFn: async () => {
      const response = await fetch('/api/signals');
      return await response.json();
    },
  });

  if (isPending) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;
  console.log(data);

  return (
    <div>
      <h1>CrossTech Platform</h1>
      <div className="w-full rounded-l shadow-sm">
        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab('tracks')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'tracks' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'
            }`}
          >
            Tracks
          </button>

          <button
            onClick={() => setActiveTab('signals')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'signals' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'
            }`}
          >
            Signals
          </button>
        </div>

        {/* Content box */}
        <div className="p-4">
          {activeTab === 'tracks' && (
            <div className="rounded-xl bg-gray-50 p-4">
              <h1 className="mb-2 text-lg font-semibold">Track content to go here</h1>
            </div>
          )}

          {activeTab === 'signals' && (
            <div className="rounded-xl bg-gray-50 p-4">
              <h1 className="mb-2 text-lg font-semibold">Signal content to go here</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
