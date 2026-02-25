import React, { useState, useEffect } from 'react';

function FileTree({ repoId, currentPath, onNavigate }) {
    const [treeFiles, setTreeFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTree = async () => {
            setIsLoading(true);
            setError('');
            try {
                // Determine API path (handle root vs specific directory)
                const encodedPath = currentPath ? currentPath.split('/').map(encodeURIComponent).join('/') : '';
                const apiPath = encodedPath ? `/tree/${encodedPath}` : '/tree';
                const response = await fetch(`http://localhost:3000/api/repositories/${repoId}${apiPath}`);
                if (!response.ok) {
                    throw new Error('Failed to load directory contents.');
                }
                const data = await response.json();
                setTreeFiles(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTree();
    }, [repoId, currentPath]);

    const getIcon = (type) => {
        if (type === 'tree') {
            return (
                <svg color="var(--blue-color, #58a6ff)" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
            );
        }
        return (
            <svg color="var(--text-secondary, #8b949e)" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
        );
    };

    if (isLoading) {
        return <div className="tree-loading">Loading directory...</div>;
    }

    if (error) {
        return <div className="tree-error">{error}</div>;
    }

    if (treeFiles.length === 0) {
        return <div className="tree-empty">This directory is empty.</div>;
    }

    return (
        <div className="file-tree-list">
            {/* If we are not at root, render a ".." directory to go back up */}
            {currentPath && (
                <div
                    className="file-tree-item"
                    onClick={() => {
                        const parts = currentPath.split('/').filter(Boolean);
                        parts.pop(); // Remove current folder
                        onNavigate(parts.join('/'), 'tree');
                    }}
                >
                    <div className="file-icon" style={{ opacity: 0 }}></div>
                    <div className="file-name" style={{ color: 'var(--blue-color, #58a6ff)', cursor: 'pointer' }}>..</div>
                </div>
            )}

            {treeFiles.map((file) => (
                <div
                    key={file.path}
                    className="file-tree-item"
                    onClick={() => onNavigate(file.path, file.type)}
                >
                    <div className="file-icon">{getIcon(file.type)}</div>
                    <div className="file-name">{file.name}</div>
                    {/* Could add commit message / time here if we expanded the backend API */}
                    <div className="file-meta"></div>
                </div>
            ))}
        </div>
    );
}

export default FileTree;
