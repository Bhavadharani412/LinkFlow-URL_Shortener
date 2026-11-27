import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { extractErrorMessage, getUrlByShortCode } from '../api/urlApi';
import { copyToClipboard, formatDate } from '../utils/urlUtils';

function LinkDetailPage() {
  const { shortCode } = useParams();
  const [urlData, setUrlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const loadDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUrlByShortCode(shortCode);
      setUrlData(data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Short URL not found.'));
    } finally {
      setLoading(false);
    }
  }, [shortCode]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const handleCopy = async () => {
    if (!urlData?.shortUrl) return;
    try {
      await copyToClipboard(urlData.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <section className="card detail-card">
      <div className="detail-top">
        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>
        {!loading && urlData && (
          <button type="button" className="btn btn-sm btn-ghost" onClick={loadDetails}>
            Refresh
          </button>
        )}
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="spinner" aria-hidden="true" />
          <p>Loading link details...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <p className="empty-title">Link unavailable</p>
          <p className="empty-description">{error}</p>
          <Link to="/" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="detail-body">
          <div className="detail-hero">
            <div>
              <span className="detail-eyebrow">Short URL</span>
              <h1 className="detail-short-url">
                <a
                  href={urlData.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setTimeout(loadDetails, 800)}
                >
                  {urlData.shortUrl}
                </a>
              </h1>
            </div>
            <button
              type="button"
              className={`btn ${copied ? 'btn-success' : 'btn-primary'}`}
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy Short URL'}
            </button>
          </div>

          <dl className="detail-grid">
            <div className="detail-item">
              <dt>Original URL</dt>
              <dd>
                <a
                  href={urlData.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-original-link"
                >
                  {urlData.originalUrl}
                </a>
              </dd>
            </div>
            <div className="detail-item">
              <dt>Short Code</dt>
              <dd className="mono">{urlData.shortCode}</dd>
            </div>
            <div className="detail-item">
              <dt>Total Clicks</dt>
              <dd>
                <span className="click-badge click-badge-lg">{urlData.clickCount}</span>
              </dd>
            </div>
            <div className="detail-item">
              <dt>Created At</dt>
              <dd>{formatDate(urlData.createdAt)}</dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}

export default LinkDetailPage;
