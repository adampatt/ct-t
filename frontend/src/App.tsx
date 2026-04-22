import './App.css';
import { useQuery } from '@tanstack/react-query';

function App() {
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
      <h1>hello</h1>
      {/* <h1>{data.full_name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong> <strong>✨ {data.stargazers_count}</strong> <strong>🍴 {data.forks_count}</strong>
      <div>{isFetching ? 'Updating...' : ''}</div> */}
    </div>
  );
}

export default App;
