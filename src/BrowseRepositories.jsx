import React, { useState, useEffect } from 'react';
import './BrowseRepositories.css';

function BrowseRepositories({ onBack, onNewRepo, onViewRepo }) {
    const [repositories, setRepositories] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Pagination & Sorting State
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('DESC');

    const fetchRepositories = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:3000/api/repositories?page=${currentPage}&limit=${limit}&sort=${sortField}&order=${sortOrder}`);
            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }
            const data = await response.json();

            // Handle both the old array format (fallback, just in case) and the new paginated object format
            if (Array.isArray(data)) {
                setRepositories(data);
                setTotal(data.length);
            } else if (data && data.data) {
                setRepositories(data.data);
                setTotal(data.total);
            } else {
                setRepositories([]);
                setTotal(0);
            }
        } catch (err) {
            console.error("Error fetching repositories:", err);
            setError('Could not load repositories. The backend server might be offline.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRepositories();
    }, [currentPage, limit, sortField, sortOrder]);

    const handleSort = (field) => {
        if (sortField === field) {
            // Toggle order if clicking the same field
            setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
        } else {
            // New field, default to DESC sort
            setSortField(field);
            setSortOrder('DESC');
        }
        // Reset to page 1 when sorting changes
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const totalPages = Math.ceil(total / limit) || 1;

    const renderSortIcon = (field) => {
        if (sortField !== field) {
            return (
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="sort-icon"><path d="M7 15l5 5 5-5"></path><path d="M7 9l5-5 5 5"></path></svg>
            );
        }
        return sortOrder === 'ASC' ? (
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="sort-icon"><path d="M12 19V5"></path><polyline points="5 12 12 5 19 12"></polyline></svg>
        ) : (
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="sort-icon"><path d="M12 5v14"></path><polyline points="19 12 12 19 5 12"></polyline></svg>
        );
    };

    return (
        <>
            <nav className="navbar" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 10 }}>
                <div className="nav-brand" onClick={onBack} style={{ cursor: 'pointer' }}>
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    CodeBucket
                </div>
            </nav>

            <div className="browse-repos-container">
                <div className="browse-repos-header">
                    <h1>Repositories</h1>
                    <button className="btn btn-primary" onClick={onNewRepo} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        New Repository
                    </button>
                </div>

                <div className="browse-repos-card">
                    <div className="table-controls">
                        <div className="search-input-wrapper">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" placeholder="Find a repository..." />
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Showing {total === 0 ? 0 : (currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, total)} of {total}
                        </div>
                    </div>

                    {isLoading && <div className="loading-state">Loading repositories...</div>}
                    {error && <div className="error-state">{error}</div>}
                    {!isLoading && !error && repositories.length === 0 && (
                        <div className="empty-state">
                            <h3>No repositories found.</h3>
                            <p>It looks like there are no repositories available.</p>
                        </div>
                    )}

                    {!isLoading && !error && repositories.length > 0 && (
                        <table className="repos-table">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('name')} className={sortField === 'name' ? 'active-sort' : ''}>
                                        Repository {renderSortIcon('name')}
                                    </th>
                                    <th onClick={() => handleSort('description')} className={sortField === 'description' ? 'active-sort' : ''}>
                                        Description {renderSortIcon('description')}
                                    </th>
                                    <th onClick={() => handleSort('visibility')} className={sortField === 'visibility' ? 'active-sort' : ''}>
                                        Visibility {renderSortIcon('visibility')}
                                    </th>
                                    <th onClick={() => handleSort('createdAt')} className={sortField === 'createdAt' ? 'active-sort' : ''}>
                                        Updated {renderSortIcon('createdAt')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {repositories.map(repo => (
                                    <tr key={repo.id}>
                                        <td>
                                            <div className="repo-name-cell">
                                                {repo.visibility === 'private' ? (
                                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                                ) : (
                                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }}><path d="M2 22l5-5"></path><path d="M22 2l-5 5"></path><path d="M12 12a4 4 0 1 0-8 8 4 4 0 0 0 8-8z"></path><path d="M22 12a4 4 0 1 1-8 8 4 4 0 0 1 8-8z"></path></svg>
                                                )}
                                                <div>
                                                    <span className="repo-owner-text">{repo.owner || 'unknown'} / </span>
                                                    <span className="repo-name-text" onClick={() => onViewRepo && onViewRepo(repo.id)}>{repo.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="repo-desc-cell">{repo.description || '-'}</td>
                                        <td>
                                            <span className="visibility-badge">{repo.visibility}</span>
                                        </td>
                                        <td className="repo-date-cell">
                                            {repo.createdAt ? new Date(repo.createdAt).toLocaleDateString() : 'Unknown'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {!isLoading && !error && totalPages > 1 && (
                        <div className="pagination-controls">
                            <button
                                className="page-btn"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <div className="pagination-info">
                                Page {currentPage} of {totalPages}
                            </div>
                            <button
                                className="page-btn"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default BrowseRepositories;
