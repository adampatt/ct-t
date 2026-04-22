import './App.css';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchSignals, fetchTracks, fetchTrackById } from './queries';

function App() {
  const [activeTab, setActiveTab] = useState<'tracks' | 'signals'>('tracks');
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
  const [selectedSignalId, setSelectedSignalId] = useState<number | null>(null);

  const {
    isPending: signalsIsPending,
    error: signalsError,
    data: signalsData = [],
  } = useQuery({
    queryKey: ['signals'],
    queryFn: fetchSignals,
    enabled: activeTab === 'signals',
  });

  const {
    isPending: tracksIsPending,
    error: tracksError,
    data: tracksData = [],
  } = useQuery({
    queryKey: ['tracks'],
    queryFn: fetchTracks,
    enabled: activeTab === 'tracks',
  });

  const effectiveSelectedTrackId = selectedTrackId ?? tracksData[0]?.track_id ?? null;

  const effectiveSelectedSignalId = selectedSignalId ?? signalsData[0]?.signal_id ?? null;

  const { data: selectedTrack } = useQuery({
    queryKey: ['track', effectiveSelectedTrackId],
    queryFn: () => fetchTrackById(effectiveSelectedTrackId!),
    enabled: activeTab === 'tracks' && effectiveSelectedTrackId !== null,
  });

  console.log(selectedTrack);

  const signalsFromTrackResponse = [
    { signal_id: 453, signal_name: 'SIG:AW148(CO) ACTON WELLS JCN', elr: 'LPC5', mileage: 3.1745 },
    { signal_id: 2848, signal_name: 'SIG:SN169(CO) IECC PDRF14 LOC R3/107', elr: 'ONM1', mileage: 4.2126 },
  ];

  const tracksFromSignalResponse = [
    { track_id: 55, source: 'Acton Central', target: 'Willesden Junction', elr: 'LPC5', mileage: 3.1745 },
    { track_id: 4084, source: 'Wembley Central', target: 'Acton Central', elr: 'PLC5', mileage: 3.0245 },
  ];
  return (
    <div>
      <h1>CrossTech Platform</h1>
      <div className="w-full rounded-l shadow-sm">
        {/* Tabs */}
        <div className="flex w-1/3">
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
            <div className="flex w-full gap-4">
              <div className="flex-1 rounded-2xl bg-gray-50 p-4">
                {tracksIsPending && 'Loading...'}
                {tracksError && `An error has occurred: ${tracksError.message}`}
                <div className="max-h-[70vh] overflow-auto rounded-lg border border-gray-200">
                  <table className="min-w-full">
                    <thead className="sticky top-0 bg-gray-100">
                      <tr>
                        <th className="px-2 py-2 text-sm font-semibold text-gray-700">Track ID</th>
                        <th className="px-2 py-2 text-sm font-semibold text-gray-700">Source Station</th>
                        <th className="px-2 py-2 text-sm font-semibold text-gray-700">Target Station</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tracksData.map((td) => (
                        <tr
                          key={td.track_id}
                          className={`cursor-pointer border-t border-gray-200 hover:bg-gray-100 ${
                            effectiveSelectedTrackId === td.track_id ? 'bg-gray-300' : 'bg-white-100'
                          }`}
                          onClick={() => setSelectedTrackId(td.track_id)}
                        >
                          <td className="px-4 py-3 text-sm text-gray-800">{td.track_id}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{td.source}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{td.target}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex-1 overflow-auto rounded-2xl bg-white p-6 shadow-md max-h-[100vh]">
                <div className="space-y-0">
                  {signalsFromTrackResponse.map((signal, index) => (
                    <div key={signal.signal_id}>
                      <div className="rounded-xl bg-gray-100 px-4 py-6 text-center">
                        <h3 className="text-sm font-semibold text-gray-900">{signal.signal_name}</h3>

                        <div className="mt-4 flex flex-col items-center gap-2 text-sm text-gray-700">
                          <div>
                            <span className="font-medium">ELR:</span> {signal.elr}
                          </div>
                          <div>
                            <span className="font-medium">Mileage:</span> {signal.mileage}
                          </div>
                        </div>
                      </div>

                      {index < signalsFromTrackResponse.length - 1 && (
                        <div className="my-3 flex justify-center">
                          <div className="h-8 border-l-2 border-dashed border-gray-300" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'signals' && (
            <div className="flex w-full gap-4">
              <div className="flex-1 rounded-2xl bg-gray-50 p-4">
                {signalsIsPending && 'Loading...'}
                {signalsError && `An error has occurred: ${signalsError.message}`}
                <div className="max-h-[70vh] overflow-auto rounded-lg border border-gray-200">
                  <table className="min-w-full">
                    <thead className="sticky top-0 bg-gray-100">
                      <tr>
                        <th className="px-2 py-2 text-sm font-semibold text-gray-700">Signal ID</th>
                        <th className="px-2 py-2 text-sm font-semibold text-gray-700">Signal Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {signalsData.map((sd) => (
                        <tr
                          key={sd.signal_id}
                          className={`cursor-pointer border-t border-gray-200 hover:bg-gray-100 ${
                            effectiveSelectedSignalId === sd.signal_id ? 'bg-gray-300' : 'bg-white-100'
                          }`}
                          onClick={() => setSelectedSignalId(sd.signal_id)}
                        >
                          <td className="px-4 py-3 text-sm text-gray-800">{sd.signal_id}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{sd.signal_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex-1 overflow-auto rounded-2xl bg-white p-6 shadow-md max-h-[100vh]">
                <div className="space-y-0">
                  <h2>Tracks</h2>
                  <p className="text-sm ">All tracks the signal is related to</p>
                  {tracksFromSignalResponse.map((track, index) => (
                    <div key={track.track_id}>
                      <div className="rounded-xl bg-gray-100 px-4 py-6 text-center">
                        <h3 className="text-sm font-semibold text-gray-900">{track.elr}</h3>

                        <div className="mt-4 flex flex-col items-center gap-2 text-sm text-gray-700">
                          <div>
                            <span className="font-medium">Source:</span> {track.source}
                          </div>
                          <div>
                            <span className="font-medium">Target:</span> {track.target}
                          </div>
                          <div>
                            <span className="font-medium">ELR:</span> {track.elr}
                          </div>
                          <div>
                            <span className="font-medium">Mileage:</span> {track.mileage}
                          </div>
                        </div>
                      </div>

                      {index < signalsFromTrackResponse.length - 1 && (
                        <div className="my-3 flex justify-center">
                          <div className="h-8 border-l-2 border-dashed border-gray-300" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
