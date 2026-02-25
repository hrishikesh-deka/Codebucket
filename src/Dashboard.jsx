import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ onSignOut, onNewRepo, onBrowse, userEmail }) {
    const [repositories, setRepositories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch repositories from backend
        fetch('http://localhost:3000/api/repositories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRepositories(data);
                } else if (data && data.data) {
                    setRepositories(data.data);
                } else {
                    setRepositories([]);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch repositories:", err);
                setRepositories([]);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="dashboard-layout">
            {/* Top Navigation */}
            <nav className="dash-navbar">
                <div className="dash-nav-left">
                    <div className="dash-logo" onClick={onSignOut} style={{ cursor: 'pointer' }}>
                        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                    </div>
                    <div className="dash-search">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Type / to search" />
                        <div className="slash-hint">/</div>
                    </div>
                    <div className="dash-links">
                        <a href="#" className="dash-link active">Dashboard</a>
                    </div>
                </div>
                <div className="dash-nav-right">
                    <button className="dash-icon-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </button>
                    <div className="dash-user-dropdown">
                        <div className="avatar">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
            </nav>

            <div className="dash-container">
                {/* Left Sidebar */}
                <aside className="dash-sidebar">
                    <div className="dash-sidebar-header">
                        <h2 className="dash-sidebar-title">Top Repositories</h2>
                        <button className="btn btn-primary btn-sm" onClick={onNewRepo} style={{ padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            New
                        </button>
                    </div>

                    <div className="dash-search-repo">
                        <input type="text" placeholder="Find a repository..." />
                    </div>

                    <div className="repo-list">
                        {isLoading ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
                        ) : repositories.length === 0 ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No repositories found.</div>
                        ) : (
                            repositories.map(repo => (
                                <div className="repo-item" key={repo.id}>
                                    <div className="repo-icon">
                                        {repo.visibility === 'private' ? (
                                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#8b949e' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#58a6ff' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                        )}
                                    </div>
                                    <div className="repo-name">
                                        <span className="repo-owner">{repo.owner || 'unknown'}</span> / <span className="repo-repo" style={{ fontWeight: 600 }}>{repo.name}</span>
                                    </div>
                                </div>
                            ))
                        )}
                        <div className="repo-item" style={{ opacity: 0.7, marginTop: '0.5rem', cursor: 'pointer' }} onClick={onBrowse}>
                            Show more
                        </div>
                    </div>

                </aside>



                {/* Main Dashboard Content */}
                <main className="dash-main">
                    {/* Welcome Section */}
                    <div className="dash-card">
                        <h2 className="card-title">Welcome to CodeBucket{userEmail ? `, ${userEmail.split('@')[0]}` : ''}!</h2>
                        <p className="card-desc" style={{ marginBottom: '1.5rem' }}>Your personal hub for sharing and browsing code.</p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button className="btn btn-primary" onClick={onNewRepo}>New Repository</button>
                            <button className="btn btn-secondary" onClick={onBrowse}>Browse All</button>
                        </div>
                    </div>

                    {/* Repository Statistics */}
                    <div className="dash-card" style={{ display: 'flex', justifyContent: 'space-around', padding: '1.5rem' }}>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{repositories.length}</div>
                            <div className="card-desc">Total Repositories</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-accent)' }}>
                                {repositories.filter(r => r.visibility === 'public').length}
                            </div>
                            <div className="card-desc">Public</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                                {repositories.filter(r => r.visibility === 'private').length}
                            </div>
                            <div className="card-desc">Private</div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="feed-header" style={{ marginTop: '2rem' }}>
                        <h2>Recent Activity</h2>
                    </div>
                    <div className="repo-list">
                        {isLoading ? (
                            <div className="empty-state-small">Loading activity...</div>
                        ) : repositories.length === 0 ? (
                            <div className="empty-state-small">
                                No activity yet. <a href="#" onClick={(e) => { e.preventDefault(); onNewRepo(); }} style={{ color: 'var(--text-accent)' }}>Upload a repository</a> to get started.
                            </div>
                        ) : (
                            // Sort by createdAt descending and take top 5
                            [...repositories]
                                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                                .slice(0, 5)
                                .map(repo => (
                                    <div className="feed-repo-card" key={`feed-${repo.id}`}>
                                        <div className="feed-repo-header">
                                            <h4 onClick={onBrowse}>{repo.owner || 'unknown'} / {repo.name}</h4>
                                            <span className="visibility-badge" style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem' }}>{repo.visibility}</span>
                                        </div>
                                        {repo.description && <div className="feed-repo-desc">{repo.description}</div>}
                                        <div className="feed-repo-stats">
                                            <div className="icon-stat">
                                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                {repo.createdAt ? new Date(repo.createdAt).toLocaleDateString() : 'Recently'}
                                            </div>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </main>

            </div>
        </div>
    );
}

export default Dashboard;
