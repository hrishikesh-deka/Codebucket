import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execFileAsync = promisify(execFile);

export interface GitTreeItem {
    mode: string;
    type: 'blob' | 'tree' | 'commit';
    hash: string;
    path: string;
    name: string;
}

@Injectable()
export class FileViewerService {
    /**
     * Normalizes and validates the user-provided path to prevent directory traversal
     * attacks (e.g. `../../../etc/passwd`).
     */
    private sanitizePath(targetPath: string): string {
        if (!targetPath) return '';
        const normalized = path.normalize(targetPath).replace(/^(\.\.[\/\\])+/, '');
        const posixPath = normalized.replace(/\\/g, '/');
        return posixPath === '.' || posixPath === '/' ? '' : posixPath;
    }

    /**
     * Executes a git command safely within a designated working directory.
     */
    private async runGitCommand(args: string[], repoPath: string): Promise<string> {
        try {
            const { stdout } = await execFileAsync('git', args, { cwd: repoPath });
            return stdout;
        } catch (error) {
            console.error(`Git command failed: git ${args.join(' ')}`, error);
            if (error.message.includes('fatal: Not a valid object name') || error.message.includes('fatal: path')) {
                throw new NotFoundException('The requested file or directory does not exist in this repository.');
            }
            throw new InternalServerErrorException('Error reading from repository configuration.');
        }
    }

    /**
     * Reads the directory structure at the given path using `git ls-tree`.
     */
    async getTree(repoPath: string, branch: string = 'HEAD', targetPath: string = ''): Promise<GitTreeItem[]> {
        const cleanPath = this.sanitizePath(targetPath);
        // If cleanPath is empty, we read the root. Otherwise we read the specific folder (appending / limits to that dir)
        const gitPath = cleanPath ? `${cleanPath}/` : '';

        try {
            const args = ['-c', 'core.quotePath=false', 'ls-tree', branch];
            if (gitPath) {
                args.push(gitPath);
            }
            const stdout = await this.runGitCommand(args, repoPath);

            const lines = stdout.split('\n').map(l => l.trim()).filter(line => line.length > 0);
            return lines.map(line => {
                // Example output: 040000 tree abc123def456\t src
                const [info, namePath] = line.split('\t');
                const [mode, type, hash] = info.split(' ');
                // namePath might be `src/utils`, we just want the basename `utils`
                const name = cleanPath ? namePath.replace(cleanPath + '/', '') : namePath;

                return {
                    mode,
                    type: type as 'blob' | 'tree' | 'commit',
                    hash,
                    path: namePath,
                    name
                };
            }).sort((a, b) => {
                // Sort directories first, then files
                if (a.type === 'tree' && b.type !== 'tree') return -1;
                if (a.type !== 'tree' && b.type === 'tree') return 1;
                return a.name.localeCompare(b.name);
            });
        } catch (err) {
            throw err;
        }
    }

    /**
     * Reads the raw text content of a file using `git show`.
     */
    async getFileContent(repoPath: string, branch: string = 'HEAD', filePath: string): Promise<string> {
        const cleanPath = this.sanitizePath(filePath);
        if (!cleanPath) {
            throw new NotFoundException('No file path provided.');
        }

        try {
            // git show HEAD:path/to/file.ext
            return await this.runGitCommand(['show', `${branch}:${cleanPath}`], repoPath);
        } catch (err) {
            throw err;
        }
    }
}
