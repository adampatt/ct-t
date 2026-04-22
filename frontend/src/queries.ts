import { z } from 'zod';

const SignalSchema = z.object({
  signal_id: z.number(),
  signal_name: z.string(),
});

const SignalsSchema = z.array(SignalSchema);

type Signal = z.infer<typeof SignalSchema>;

export const fetchSignals = async (): Promise<Signal[] | null> => {
  const response = await fetch('/api/signals');

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const json = await response.json();

  // Using safeparse here to return error without try / catch - https://zod.dev/basics
  const result = SignalsSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid response ${result.error}`);
  }

  return result.data;
};
