import './App.css';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { fetchSignals, fetchTracks, fetchTrackById, fetchSignalByID } from './queries';

function App() {
  const [activeTab, setActiveTab] = useState<'tracks' | 'signals'>('tracks');
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
  const [selectedSignalId, setSelectedSignalId] = useState<number | null>(null);

  const [trackIdFilter, setTrackIdFilter] = useState('');
  const [stationFilter, setStationFilter] = useState('');

  // Data fetching

  // Data for tabs
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

  // https://tanstack.com/query/v5/docs/framework/react/guides/query-keys#if-your-query-function-depends-on-a-variable-include-it-in-your-query-key
  // using the selectedTrackID because tracksData[0]?.track_id exists the query was being run, but selectedTrackID is null because the user has not slelected a value yet. Causing the query to run with null.
  const { data: signalsByIDData } = useQuery({
    queryKey: ['signals', effectiveSelectedSignalId],
    queryFn: () => fetchSignalByID(effectiveSelectedSignalId),
    enabled: activeTab === 'signals' && effectiveSelectedSignalId !== null,
  });

  const { data: tracksByIDData } = useQuery({
    queryKey: ['track', effectiveSelectedTrackId],
    queryFn: () => fetchTrackById(effectiveSelectedTrackId),
    enabled: activeTab === 'tracks' && effectiveSelectedTrackId !== null,
  });

  // Used to filter table data
  const filteredTracks = useMemo(() => {
    return tracksData.filter((td) => {
      const matchesTrackId = String(td.track_id).toLowerCase().includes(trackIdFilter.toLowerCase());

      const matchesStation =
        td.source.toLowerCase().includes(stationFilter.toLowerCase()) || td.target.toLowerCase().includes(stationFilter.toLowerCase());

      return matchesTrackId && matchesStation;
    });
  }, [tracksData, trackIdFilter, stationFilter]);

  return (
    <div className="flex h-screen flex-col">
      <h1 className="shrink-0 px-0 pb-8 pt-8 text-xl font-bold text-gray-900">CrossTech Platform</h1>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-l shadow-sm">
        {/* Tabs */}
        <div className="flex w-1/3 shrink-0">
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
        <div className="flex min-h-0 flex-1 flex-col p-4">
          {activeTab === 'tracks' && (
            <div className="flex min-h-0 flex-1 w-full gap-4 p-4">
              <div className="flex min-h-0 flex-1 flex-col rounded-2xl bg-gray-50 p-4">
                {tracksIsPending && 'Loading...'}
                {tracksError && `An error has occurred: ${tracksError.message}`}

                <div className="flex flex-col space-y-3 pb-5 pt-3 pl-3">
                  <div className="flex flex-col items-start">
                    <h3 className="text-m font-semibold text-gray-900">Track information</h3>
                    <p className="text-sm text-gray-400">All tracks</p>
                  </div>

                  <div className="flex w-2/3 items-center justify-center gap-3">
                    <span className="text-m font-semibold text-gray-900">Filter:</span>

                    <input
                      type="text"
                      value={trackIdFilter}
                      onChange={(e) => setTrackIdFilter(e.target.value)}
                      placeholder="Track ID"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />

                    <input
                      type="text"
                      value={stationFilter}
                      onChange={(e) => setStationFilter(e.target.value)}
                      placeholder="Source or target"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-gray-200">
                  <table className="min-w-full table-fixed border-collapse">
                    <thead className="sticky top-0 bg-gray-100">
                      <tr>
                        <th className="w-1/4 px-4 py-3 text-left text-m font-semibold text-gray-900">Track ID</th>
                        <th className="w-3/8 px-4 py-3 text-left text-m font-semibold text-gray-900">Source</th>
                        <th className="w-3/8 px-4 py-3 text-left text-m font-semibold text-gray-900">Target</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTracks.map((td) => (
                        <tr
                          key={td.track_id}
                          className={`cursor-pointer border-t border-gray-200 hover:bg-gray-100 ${
                            effectiveSelectedTrackId === td.track_id ? 'bg-gray-300' : 'bg-white'
                          }`}
                          onClick={() => setSelectedTrackId(td.track_id)}
                        >
                          <td className="px-4 py-3 text-right text-sm text-gray-800">{td.track_id}</td>
                          <td className="px-4 py-3 text-left text-sm text-gray-800">{td.source}</td>
                          <td className="px-4 py-3 text-left text-sm text-gray-800">{td.target}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex-1 overflow-auto rounded-2xl bg-white p-6 shadow-md">
                <div className="space-y-3">
                  <h3 className="text-m font-semibold text-gray-900">All signals assoicated with track id {selectedTrackId}</h3>
                  {tracksByIDData?.signals.map((signal, index) => (
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

                      {index < tracksByIDData.signals.length - 1 && (
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
            <div className="flex min-h-0 flex-1 w-full gap-4 p-4">
              <div className="flex min-h-0 flex-1 flex-col rounded-2xl bg-gray-50 p-4">
                {signalsIsPending && 'Loading...'}
                {signalsError && `An error has occurred: ${signalsError.message}`}
                <div className="flex flex-col space-y-3 pb-5 pt-3 pl-3">
                  <div className="flex flex-col items-start">
                    <h3 className="text-m font-semibold text-gray-900">Signal information</h3>
                    <p className="text-sm text-gray-400">All available signals</p>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-gray-200">
                  <table className="min-w-full">
                    <thead className="sticky top-0 bg-gray-100">
                      <tr>
                        <th className="px-2 py-3 text-m text-left font-semibold text-gray-900">Signal ID</th>
                        <th className="px-2 py-3 text-m text-left font-semibold text-gray-900">Signal Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {signalsData?.map((sd) => (
                        <tr
                          key={sd.signal_id}
                          className={`cursor-pointer border-t border-gray-200 hover:bg-gray-100 ${
                            effectiveSelectedSignalId === sd.signal_id ? 'bg-gray-300' : 'bg-white'
                          }`}
                          onClick={() => setSelectedSignalId(sd.signal_id)}
                        >
                          <td className="px-4 py-3 text-sm text-left text-gray-800">{sd.signal_id}</td>
                          <td className="px-4 py-3 text-sm text-left text-gray-800">{sd.signal_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex-1 overflow-auto rounded-2xl bg-white p-6 shadow-md">
                <div className="space-y-3">
                  <h3 className="text-m font-semibold text-gray-900">All tracks assoicated with signal {selectedSignalId}</h3>
                  {signalsByIDData?.tracks.map((track, index) => (
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

                      {index < signalsByIDData.tracks.length - 1 && (
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
