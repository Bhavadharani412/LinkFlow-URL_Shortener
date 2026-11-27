import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LinkDetailPage from './pages/LinkDetailPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/links/:shortCode" element={<LinkDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <span>LinkFlow — URL Shortener</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
