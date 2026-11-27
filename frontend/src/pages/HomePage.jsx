import { useCallback, useEffect, useState } from 'react';
import { deleteUrl, extractErrorMessage, getAllUrls } from '../api/urlApi';
import UrlDashboard from '../components/UrlDashboard';
import UrlShortenerForm from '../components/UrlShortenerForm';

function HomePage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllUrls();
      setUrls(data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load URLs.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  useEffect(() => {
    const handleFocus = () => {
      fetchUrls();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchUrls]);

  const handleUrlCreated = (newUrl) => {
    setUrls((prev) => [newUrl, ...prev]);
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteUrl(id);
      setUrls((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to delete URL.'));
    }
  };

  return (
    <div className="stack">
      <UrlShortenerForm onUrlCreated={handleUrlCreated} />
      <UrlDashboard
        urls={urls}
        loading={loading}
        error={error}
        onRefresh={fetchUrls}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default HomePage;
