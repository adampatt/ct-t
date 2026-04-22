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
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Track ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Source</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {tracksData.map((td) => (
                    <tr
                      key={td.trackId}
                      className="border-t border-gray-200"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800">{td.trackId}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{td.source}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{td.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'signals' && (
            <div className="rounded-xl bg-gray-50 p-4">
              {signalsIsPending && 'Loading...'}
              {signalsError && `An error has occurred: ${signalsError.message}`}
              <h1 className="mb-2 text-lg font-semibold">Signal content to go here</h1>
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Signal ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Signal Name</th>
                  </tr>
                </thead>
                <tbody>
                  {signalsData.map((signal) => (
                    <tr
                      key={signal.ID}
                      className="border-t border-gray-200"
                    >
                      {/* <td className="px-4 py-3 text-sm text-gray-800">{signal.track_id}</td> */}
                      {/* <td className="px-4 py-3 text-sm text-gray-800">{signal.}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
