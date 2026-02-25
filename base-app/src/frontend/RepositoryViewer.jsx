import React, { useState, useEffect } from 'react';
import FileTree from './FileTree';
import FileBlob from './FileBlob';
import './RepositoryViewer.css';

function RepositoryViewer({ repoId, onBack }) {
    const [repo, setRepo] = useState(null);
    const [currentPath, setCurrentPath] = useState('');
    const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'blob'
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch repository details to get the name/owner for the header
        const fetchRepoDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/repositories/${repoId}`);
                if (!response.ok) throw new Error('Repository not found');
                const data = await response.json();
                setRepo(data);
            } catch (err) {
                setError('Failed to load repository details.');
            } finally {
                setIsLoading(false);
            }
        };

        if (repoId) fetchRepoDetails();
    }, [repoId]);

    const handleNavigate = (path, type) => {
        setCurrentPath(path);
        if (type === 'blob') {
            setViewMode('blob');
        } else {
            setViewMode('tree');
        }
    };

    const handleBreadcrumbClick = (path) => {
        setCurrentPath(path);
        setViewMode('tree');
    };

    if (isLoading) {
        return <div className="repo-viewer-loading">Loading repository...</div>;
    }

    if (error || !repo) {
        return (
            <div className="repo-viewer-error">
                <button className="btn btn-secondary" onClick={onBack}>← Back to Dashboard</button>
                <h2>{error || 'Repository not found'}</h2>
            </div>
        );
    }

    return (
        <div className="repo-viewer-container">
            {/* Header / Navbar equivalent */}
            <nav className="navbar" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 10 }}>
                <div className="nav-brand" onClick={onBack} style={{ cursor: 'pointer' }}>
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    CodeBucket
                </div>
                <div className="nav-actions">
                    <button className="btn btn-secondary btn-sm" onClick={onBack}>Dashboard</button>
                </div>
            </nav>

            <div className="repo-viewer-content">
                <div className="repo-header">
                    <div className="repo-title">
                        {repo.visibility === 'private' ? (
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="repo-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        ) : (
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="repo-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        )}
                        <span className="owner">{repo.owner || 'company'}</span>
                        <span className="separator">/</span>
                        <span className="name">{repo.name}</span>
                        <span className="visibility-badge">{repo.visibility}</span>
                    </div>
                    {repo.description && <p className="repo-description">{repo.description}</p>}
                </div>

                <div className="repo-body">
                    <div className="file-explorer-card">
                        <Breadcrumbs currentPath={currentPath} onNavigate={handleBreadcrumbClick} />

                        {viewMode === 'tree' ? (
                            <FileTree repoId={repoId} currentPath={currentPath} onNavigate={handleNavigate} />
                        ) : (
                            <FileBlob repoId={repoId} filePath={currentPath} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Breadcrumbs({ currentPath, onNavigate }) {
    const parts = currentPath.split('/').filter(Boolean);

    return (
        <div className="breadcrumbs">
            <span className="breadcrumb-part" onClick={() => onNavigate('')}>
                <span className="repo-root">code</span>
            </span>
            {parts.length > 0 && <span className="breadcrumb-separator">/</span>}

            {parts.map((part, index) => {
                const navPath = parts.slice(0, index + 1).join('/');
                const isLast = index === parts.length - 1;

                return (
                    <React.Fragment key={navPath}>
                        <span
                            className={`breadcrumb-part ${isLast ? 'breadcrumb-current' : ''}`}
                            onClick={() => !isLast && onNavigate(navPath)}
                        >
                            {part}
                        </span>
                        {!isLast && <span className="breadcrumb-separator">/</span>}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default RepositoryViewer;
