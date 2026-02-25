import React, { useState, useEffect } from 'react';

function FileBlob({ repoId, filePath }) {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlob = async () => {
            setIsLoading(true);
            setError('');
            try {
                const encodedPath = filePath ? filePath.split('/').map(encodeURIComponent).join('/') : '';
                const response = await fetch(`http://localhost:3000/api/repositories/${repoId}/blob/${encodedPath}`);
                if (!response.ok) {
                    throw new Error('Failed to load file contents.');
                }
                const data = await response.json();
                setContent(data.content);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (filePath) {
            fetchBlob();
        }
    }, [repoId, filePath]);

    if (isLoading) {
        return <div className="blob-loading">Loading file contents...</div>;
    }

    if (error) {
        return <div className="blob-error">{error}</div>;
    }

    // Determine basic language for simple syntax highlighting class (e.g. for PrismJS if added later)
    const ext = filePath.split('.').pop();
    const languageClass = `language-${ext}`;

    return (
        <div className="file-blob-container">
            <div className="file-blob-header">
                <div className="file-info">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                    <span>{filePath.split('/').pop()}</span>
                    <span className="file-size">{new Blob([content]).size} bytes</span>
                </div>
                <div className="file-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(content)}>Copy</button>
                    <button className="btn btn-secondary btn-sm">Raw</button>
                </div>
            </div>

            <div className="file-blob-content">
                <pre>
                    <code className={languageClass}>
                        {content}
                    </code>
                </pre>
            </div>
        </div>
    );
}

export default FileBlob;
