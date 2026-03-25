import { useEffect, useState } from 'react';
import './App.css';

const BACKEND_URL = 'https://lab5-backend-devin-hed0duezcwdkd2d6.southeastasia-01.azurewebsites.net/weatherforecast';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBackend = async () => {
      try {
        const response = await fetch(BACKEND_URL);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        let payload;

        if (contentType && contentType.includes('application/json')) {
          payload = await response.json();
        } else {
          payload = await response.text();
        }

        if (isMounted) {
          setData(payload);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Something went wrong.');
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p className="App-status App-status--loading">Loading...</p>;
    }

    if (error) {
      return (
        <p className="App-status App-status--error">Error: {error}</p>
      );
    }

    if (data === null) {
      return (
        <p className="App-status App-status--empty">
          No data received from the backend.
        </p>
      );
    }

    const formatted =
      typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);

    return (
      <pre className="App-response" aria-live="polite">
        {formatted}
      </pre>
    );
  };

  return (
    <div className="App">
      <div className="App-shell">
        <h1 className="App-title">Backend API Response</h1>
        <div className="App-card">{renderContent()}</div>
      </div>
    </div>
  );
}

export default App;
