import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="LinkFlow Home">
          <span className="brand-mark" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </span>
          <span className="brand-name">LinkFlow</span>
        </Link>
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
