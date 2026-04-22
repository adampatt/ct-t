import { z } from 'zod';

const SignalSchema = z.object({
  signal_id: z.number(),
  signal_name: z.string().nullable(),
});

const SignalsSchema = z.array(SignalSchema);

type Signal = z.infer<typeof SignalSchema>;

const SignalTrackSchema = z.object({
  track_id: z.number(),
  source: z.string(),
  target: z.string(),
  elr: z.string(),
  mileage: z.number().nullable(),
});

const SignalResponseSchema = z.object({
  signal_id: z.number(),
  signal_name: z.string().nullable(),
  tracks: z.array(SignalTrackSchema),
});

type SignalResponse = z.infer<typeof SignalResponseSchema>;

const TrackSignalSchema = z.object({
  signal_id: z.number(),
  signal_name: z.string().nullable(),
  elr: z.string(),
  mileage: z.number().nullable(),
});

const TrackSchema = z.object({
  track_id: z.number(),
  source: z.string(),
  target: z.string(),
  signals: z.array(TrackSignalSchema),
});

const TracksSchema = z.array(TrackSchema);

type Track = z.infer<typeof TrackSchema>;

export const fetchSignals = async (): Promise<Signal[]> => {
  const response = await fetch('/api/signals');
  // Throw error, useQuery is looking for this not a null value
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

  const result = SignalsSchema.safeParse(await response.json());
  if (!result.success) throw new Error(`Invalid response: ${result.error}`);

  return result.data;
};

export const fetchSignalByID = async (id: number): Promise<SignalResponse> => {
  const response = await fetch(`/api/signals/${id}`);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

  const result = SignalResponseSchema.safeParse(await response.json());
  if (!result.success) throw new Error(`Invalid response: ${result.error}`);

  return result.data;
};

export const fetchTracks = async (): Promise<Track[]> => {
  const response = await fetch('/api/tracks');
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

  const result = TracksSchema.safeParse(await response.json());
  if (!result.success) throw new Error(`Invalid response: ${result.error}`);

  return result.data;
};

export const fetchTrackById = async (id: number): Promise<Track> => {
  const response = await fetch(`/api/tracks/${id}`);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

  const result = TrackSchema.safeParse(await response.json());
  if (!result.success) throw new Error(`Invalid response: ${result.error}`);

  return result.data;
};
