import { useState } from 'react';
import { Link } from 'react-router-dom';
import { copyToClipboard, formatDate } from '../utils/urlUtils';

function UrlDashboard({ urls, loading, error, onRefresh, onDelete }) {
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleCopy = async (url) => {
    try {
      await copyToClipboard(url.shortUrl);
      setCopiedId(url.id);
      setTimeout(() => {
        setCopiedId((current) => (current === url.id ? null : current));
      }, 2000);
    } catch {
      // Clipboard error ignored if user denies browser permission
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="card dashboard-card" aria-labelledby="dashboard-heading">
      <div className="dashboard-header">
        <div>
          <h2 id="dashboard-heading" className="section-title">
            Your Shortened URLs
          </h2>
          <p className="section-subtitle">
            {urls.length} {urls.length === 1 ? 'link' : 'links'} stored
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error dashboard-alert" role="alert">
          <span>{error}</span>
          <button type="button" className="btn btn-sm btn-secondary" onClick={onRefresh}>
            Retry
          </button>
        </div>
      )}

      {loading && urls.length === 0 ? (
        <div className="empty-state">
          <div className="spinner" aria-hidden="true" />
          <p>Loading your shortened URLs...</p>
        </div>
      ) : urls.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No shortened URLs yet</p>
          <p className="empty-description">
            Paste a long URL in the box above to generate your first short link.
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="url-table">
            <thead>
              <tr>
                <th>Short URL</th>
                <th>Original URL</th>
                <th>Clicks</th>
                <th>Created</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url) => (
                <tr key={url.id}>
                  <td data-label="Short URL">
                    <div className="short-url-cell">
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="short-link"
                        onClick={() => {
                          setTimeout(onRefresh, 800);
                        }}
                      >
                        {url.shortUrl}
                      </a>
                      <Link
                        to={`/links/${url.shortCode}`}
                        className="details-link"
                        title="View link details"
                      >
                        Details
                      </Link>
                    </div>
                  </td>
                  <td data-label="Original URL">
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="original-link"
                      title={url.originalUrl}
                    >
                      {url.originalUrl}
                    </a>
                  </td>
                  <td data-label="Clicks">
                    <span className="click-badge">{url.clickCount}</span>
                  </td>
                  <td data-label="Created" className="date-cell">
                    {formatDate(url.createdAt)}
                  </td>
                  <td data-label="Actions" className="actions-cell">
                    <button
                      type="button"
                      className={`btn btn-sm ${copiedId === url.id ? 'btn-success' : 'btn-secondary'}`}
                      onClick={() => handleCopy(url)}
                    >
                      {copiedId === url.id ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(url.id)}
                      disabled={deletingId === url.id}
                    >
                      {deletingId === url.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default UrlDashboard;
