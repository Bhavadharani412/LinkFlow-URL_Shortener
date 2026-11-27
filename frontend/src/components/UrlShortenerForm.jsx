import { useState } from 'react';
import { createShortUrl, extractErrorMessage } from '../api/urlApi';
import { copyToClipboard, validateUrlInput } from '../utils/urlUtils';

function UrlShortenerForm({ onUrlCreated }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdUrl, setCreatedUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const validationError = validateUrlInput(originalUrl);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const result = await createShortUrl(originalUrl.trim());
      setCreatedUrl(result);
      setOriginalUrl('');
      setCopied(false);
      onUrlCreated(result);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to shorten URL. Please check the URL and try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!createdUrl?.shortUrl) return;
    try {
      await copyToClipboard(createdUrl.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy to clipboard automatically. Please copy the link manually.');
    }
  };

  return (
    <section className="card shortener-card" aria-labelledby="shortener-heading">
      <div className="shortener-header">
        <h1 id="shortener-heading" className="page-title">
          Shorten long links in seconds
        </h1>
        <p className="page-subtitle">
          Paste any long URL below to generate a clean, shareable link and track every visit.
        </p>
      </div>

      <form className="shortener-form" onSubmit={handleSubmit} noValidate>
        <div className="input-group">
          <label htmlFor="original-url-input" className="sr-only">
            Long URL
          </label>
          <input
            id="original-url-input"
            type="url"
            className={`url-input ${error ? 'url-input-error' : ''}`}
            placeholder="https://example.com/products/electronics/smartphones/latest-model"
            value={originalUrl}
            onChange={(e) => {
              setOriginalUrl(e.target.value);
              if (error) setError('');
            }}
            disabled={submitting}
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Shortening...' : 'Shorten URL'}
          </button>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}
      </form>

      {createdUrl && (
        <div className="result-banner" role="status" aria-live="polite">
          <div className="result-details">
            <span className="result-label">Short link ready</span>
            <a
              href={createdUrl.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="result-short-url"
            >
              {createdUrl.shortUrl}
            </a>
            <span className="result-original-url" title={createdUrl.originalUrl}>
              {createdUrl.originalUrl}
            </span>
          </div>
          <button
            type="button"
            className={`btn ${copied ? 'btn-success' : 'btn-secondary'}`}
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </section>
  );
}

export default UrlShortenerForm;
