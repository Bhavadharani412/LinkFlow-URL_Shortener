import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="card empty-state">
      <h1 className="empty-title">404 — Page Not Found</h1>
      <p className="empty-description">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Dashboard
      </Link>
    </section>
  );
}

export default NotFoundPage;
