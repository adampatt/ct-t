import './App.css';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState<'tracks' | 'signals'>('tracks');

  const {
    isPending: signalsIsPending,
    error: signalsError,
    data: signalsData,
  } = useQuery({
    queryKey: ['signals'],
    queryFn: async () => {
      const response = await fetch('/api/signals');
      return await response.json();
    },
    enabled: activeTab === 'signals',
  });

  const {
    isPending: tracksIsPending,
    error: tracksError,
    data: tracksData,
  } = useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      const response = await fetch('/api/tracks');
      return await response.json();
    },
    enabled: activeTab === 'tracks',
  });

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
              {tracksIsPending && 'Loading...'}
              {tracksError && `An error has occurred: ${tracksError.message}`}
              <h1 className="mb-2 text-lg font-semibold">Track content to go here</h1>
            </div>
          )}

          {activeTab === 'signals' && (
            <div className="rounded-xl bg-gray-50 p-4">
              {signalsIsPending && 'Loading...'}
              {signalsError && `An error has occurred: ${signalsError.message}`}
              <h1 className="mb-2 text-lg font-semibold">Signal content to go here</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
