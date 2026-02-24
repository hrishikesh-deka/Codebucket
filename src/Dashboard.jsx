import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ onSignOut, onNewRepo }) {
    const [repositories, setRepositories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch repositories from backend
        fetch('http://localhost:3000/api/repositories')
            .then(res => res.json())
            .then(data => {
                setRepositories(Array.isArray(data) ? data : []);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch repositories:", err);
                // If backend is down, we use mockup data
                setRepositories([
                    { id: '1', name: 'backend-api', visibility: 'public', description: 'Core API services' },
                    { id: '2', name: 'frontend-monorepo', visibility: 'private', description: 'React application' }
                ]);
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
                        <a href="#" className="dash-link">Pull requests</a>
                        <a href="#" className="dash-link">Issues</a>
                        <a href="#" className="dash-link">Explore</a>
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
                                        <span className="repo-owner">company</span> / <span className="repo-repo" style={{ fontWeight: 600 }}>{repo.name}</span>
                                    </div>
                                </div>
                            ))
                        )}
                        <div className="repo-item" style={{ opacity: 0.7, marginTop: '0.5rem' }}>
                            Show more
                        </div>
                    </div>

                    <div className="dash-sidebar-header" style={{ marginTop: '2rem' }}>
                        <h2 className="dash-sidebar-title">Recent activity</h2>
                    </div>
                    <div className="empty-state-small">
                        When you have recent activity, it will show up here.
                    </div>
                </aside>

                {/* Main Feed */}
                <main className="dash-main">
                    <div className="feed-header">
                        <h2>Home</h2>
                        <div className="feed-filters">
                            <button className="dash-btn active">For you</button>
                            <button className="dash-btn">Following</button>
                        </div>
                    </div>

                    <div className="dash-card">
                        <h3 className="card-title">Discover interesting projects and people to populate your personal news feed.</h3>
                        <p className="card-desc">Your news feed helps you keep up with recent activity on repositories you watch and people you follow.</p>
                        <button className="btn btn-outline" style={{ marginTop: '1rem' }}>Explore CodeBucket</button>
                    </div>

                    <div className="feed-items">
                        {/* Feed Item 1 */}
                        <div className="feed-item">
                            <div className="feed-icon-col">
                                <div className="feed-avatar">
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                            </div>
                            <div className="feed-content">
                                <div className="feed-meta">
                                    <span className="feed-user">alex-dev</span> starred <span className="feed-target">open-source-hq/hyperion</span> <span className="feed-time">2 hours ago</span>
                                </div>
                                <div className="feed-repo-card">
                                    <div className="feed-repo-header">
                                        <h4>open-source-hq / hyperion</h4>
                                        <button className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                            Star
                                        </button>
                                    </div>
                                    <p className="feed-repo-desc">A blazing fast modern microservices framework built in Rust.</p>
                                    <div className="feed-repo-stats">
                                        <span className="lang-stat"><span className="lang-color rust"></span> Rust</span>
                                        <span className="icon-stat"><svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> 12.4k</span>
                                        <span className="feed-time">Updated Oct 24</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feed Item 2 */}
                        <div className="feed-item">
                            <div className="feed-icon-col">
                                <div className="feed-avatar" style={{ background: '#2ea043' }}>
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                </div>
                            </div>
                            <div className="feed-content">
                                <div className="feed-meta">
                                    <span className="feed-user">sarah-engineer</span> created a repository <span className="feed-target">sarah-engineer/react-hooks-library</span> <span className="feed-time">5 hours ago</span>
                                </div>
                                <div className="feed-repo-card">
                                    <div className="feed-repo-header">
                                        <h4>sarah-engineer / react-hooks-library</h4>
                                        <button className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                            Star
                                        </button>
                                    </div>
                                    <p className="feed-repo-desc">A collection of custom React hooks for common use cases.</p>
                                    <div className="feed-repo-stats">
                                        <span className="lang-stat"><span className="lang-color ts"></span> TypeScript</span>
                                        <span className="feed-time">Updated today</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }}>More activity</button>
                    </div>
                </main>

                {/* Right Sidebar */}
                <aside className="dash-sidebar-right">
                    <div className="explore-card">
                        <h3>Explore Repositories</h3>

                        <div className="explore-item">
                            <div className="explore-header">
                                <div className="explore-repo">tailwindlabs / tailwindcss</div>
                            </div>
                            <div className="explore-desc">A utility-first CSS framework for rapid UI development.</div>
                            <div className="feed-repo-stats">
                                <span className="lang-stat"><span className="lang-color js"></span> JavaScript</span>
                                <span className="icon-stat"><svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> 73.1k</span>
                            </div>
                        </div>

                        <div className="explore-item">
                            <div className="explore-header">
                                <div className="explore-repo">facebook / react</div>
                            </div>
                            <div className="explore-desc">The library for web and native user interfaces.</div>
                            <div className="feed-repo-stats">
                                <span className="lang-stat"><span className="lang-color js"></span> JavaScript</span>
                                <span className="icon-stat"><svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> 214k</span>
                            </div>
                        </div>

                        <a href="#" className="explore-more">Explore more →</a>
                    </div>

                    <div className="dash-footer-links">
                        <a href="#">Blog</a> •
                        <a href="#">About</a> •
                        <a href="#">Shop</a> •
                        <a href="#">Contact</a> •
                        <a href="#">Pricing</a> •
                        <a href="#">API</a> •
                        <a href="#">Training</a> •
                        <a href="#">Status</a> •
                        <a href="#">Security</a> •
                        <a href="#">Terms</a> •
                        <a href="#">Privacy</a> •
                        <a href="#">Docs</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Dashboard;
