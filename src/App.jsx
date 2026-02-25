import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import NewRepository from './NewRepository';
import BrowseRepositories from './BrowseRepositories';
import RepositoryViewer from './RepositoryViewer';
import Login from './Login';
import './index.css';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState('landing'); // 'landing' | 'dashboard' | 'new_repo' | 'login' | 'browse_repos' | 'repo_viewer'
  const [userEmail, setUserEmail] = useState(null);
  const [currentRepoId, setCurrentRepoId] = useState(null);

  useEffect(() => {
    // Check for existing session
    const savedEmail = localStorage.getItem('codebucket_user_email');
    if (savedEmail) {
      setUserEmail(savedEmail);
      setView('dashboard');
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = (email) => {
    setUserEmail(email);
    setView('dashboard');
  };

  const handleSignOut = () => {
    localStorage.removeItem('codebucket_user_email');
    setUserEmail(null);
    setView('landing');
  };

  if (view === 'login') {
    return <Login onLogin={handleLogin} onBack={() => setView('landing')} />;
  }

  if (view === 'dashboard') {
    return <Dashboard onSignOut={handleSignOut} onNewRepo={() => setView('new_repo')} onBrowse={() => setView('browse_repos')} userEmail={userEmail} />;
  }

  if (view === 'new_repo') {
    return (
      <>
        <nav className="navbar" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', position: 'sticky' }}>
          <div className="nav-brand" onClick={() => setView('dashboard')} style={{ cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            CodeBucket
          </div>
        </nav>
        <NewRepository userEmail={userEmail} onCancel={() => setView('dashboard')} onCreateSuccess={() => setView('dashboard')} />
      </>
    );
  }

  if (view === 'browse_repos') {
    return <BrowseRepositories
      onBack={() => setView('dashboard')}
      onNewRepo={() => setView('new_repo')}
      onViewRepo={(id) => { setCurrentRepoId(id); setView('repo_viewer'); }}
    />;
  }

  if (view === 'repo_viewer' && currentRepoId) {
    return <RepositoryViewer repoId={currentRepoId} onBack={() => setView('dashboard')} />;
  }
  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-brand">
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          CodeBucket
        </div>
        <div className="nav-links">
          <a href="#product" className="nav-item">Product</a>
          <a href="#solutions" className="nav-item">Solutions</a>
          <a href="#opensource" className="nav-item">Open Source</a>
          <a href="#pricing" className="nav-item">Pricing</a>
        </div>
        <div className="nav-actions">
          <button className="btn btn-outline" style={{ border: 'none' }} onClick={() => setView('login')}>Sign In</button>
          <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => setView('login')}>Sign Up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">


          <p className="hero-subtitle">
            CodeBucket is the complete developer platform to build, scale, and deliver secure software.
            Join millions of developers shaping the future of open source.
          </p>
          <div className="hero-cta">
            <input type="email" placeholder="Email address" className="hero-input" />
            <button className="btn btn-primary" onClick={() => setView('login')}>Sign up for CodeBucket</button>
          </div>
        </div>

        {/* Showcase Window */}
        <div className="showcase-container">
          <div className="showcase-window">
            <div className="window-header">
              <div className="window-dot dot-red"></div>
              <div className="window-dot dot-yellow"></div>
              <div className="window-dot dot-green"></div>
              <div style={{ marginLeft: '1rem', color: '#8b949e', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                codebucket / open-source-core / main
              </div>
            </div>
            <div className="window-body">
              <div className="sidebar">
                <div style={{ color: '#8b949e', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase' }}>Files</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e6edf3', fontSize: '0.9rem' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#58a6ff' }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    src
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', fontSize: '0.9rem', paddingLeft: '1.5rem' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                    main.rs
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', fontSize: '0.9rem', paddingLeft: '1.5rem' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                    utils.rs
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', fontSize: '0.9rem' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                    Cargo.toml
                  </div>
                </div>
              </div>
              <div className="main-content">
                <div className="code-header">
                  <div className="code-repo">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    main.rs <span>• 240 bytes</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Raw</button>
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Blame</button>
                  </div>
                </div>
                <div className="code-block">
                  <div className="code-line"><span className="line-number">1</span><span className="token-keyword">use</span> std::collections::HashMap;</div>
                  <div className="code-line"><span className="line-number">2</span></div>
                  <div className="code-line"><span className="line-number">3</span><span className="token-comment">// Fast syntax highlighting via CodeBucket</span></div>
                  <div className="code-line"><span className="line-number">4</span><span className="token-keyword">pub fn</span> <span className="token-function">parse_repository</span>(url: <span className="token-keyword">&</span><span className="token-function">str</span>) -<span className="token-operator">&gt;</span> <span className="token-function">Result</span>&lt;Repo, Error&gt; {'{'}</div>
                  <div className="code-line"><span className="line-number">5</span>    <span className="token-keyword">let</span> <span className="token-keyword">mut</span> options <span className="token-operator">=</span> HashMap::<span className="token-function">new</span>();</div>
                  <div className="code-line"><span className="line-number">6</span>    options.<span className="token-function">insert</span>(<span className="token-string">"depth"</span>, <span className="token-string">"1"</span>);</div>
                  <div className="code-line"><span className="line-number">7</span>    </div>
                  <div className="code-line"><span className="line-number">8</span>    <span className="token-keyword">let</span> repo <span className="token-operator">=</span> git::<span className="token-function">clone</span>(url, options)<span className="token-operator">?</span>;</div>
                  <div className="code-line"><span className="line-number">9</span>    <span className="token-function">println!</span>(<span className="token-string">"Successfully cloned: { }"</span>, repo.name);</div>
                  <div className="code-line"><span className="line-number">10</span>    </div>
                  <div className="code-line"><span className="line-number">11</span>    <span className="token-function">Ok</span>(repo)</div>
                  <div className="code-line"><span className="line-number">12</span>{'}'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



    </div>
  );
}

export default App;
