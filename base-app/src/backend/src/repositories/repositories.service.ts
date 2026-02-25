import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from './repository.entity';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
const AdmZip = require('adm-zip');

const execAsync = promisify(exec);

@Injectable()
export class RepositoriesService {
    constructor(
        @InjectRepository(Repository)
        private readonly repositoryRepo: TypeOrmRepository<Repository>,
    ) { }

    async createRepository(
        name: string,
        description: string,
        visibility: string,
        owner: string,
        file?: Express.Multer.File,
        githubUrl?: string,
    ): Promise<Repository> {
        const reposDir = path.join(process.cwd(), 'git-storage');
        if (!fs.existsSync(reposDir)) {
            fs.mkdirSync(reposDir, { recursive: true });
        }

        const uniqueRepoName = `${name}-${Date.now()}`;
        const extractPath = path.join(reposDir, `extracted-${uniqueRepoName}`);
        const bareRepoPath = path.join(reposDir, `${uniqueRepoName}.git`);

        try {
            if (githubUrl) {
                let cleanUrl = githubUrl.trim();
                if (cleanUrl.toLowerCase().startsWith('git clone ')) {
                    cleanUrl = cleanUrl.replace(/^git\s+clone\s+/i, '').trim();
                }
                // Remove any surrounding single or double quotes
                cleanUrl = cleanUrl.replace(/^['"]|['"]$/g, '');

                // Determine if it's already a bare clone or needs one, straightforward bare clone works best
                await execAsync(`git clone --bare "${cleanUrl}" "${bareRepoPath}"`);
            } else if (file) {
                // 1. Extract ZIP file
                const zip = new AdmZip(file.buffer);
                zip.extractAllTo(extractPath, true);

                // 2. Initialize a local git repository in extracted folder
                await execAsync(`git init`, { cwd: extractPath });
                await execAsync(`git add .`, { cwd: extractPath });
                await execAsync(`git commit -m "Initial commit from CodeBucket upload"`, {
                    cwd: extractPath,
                    env: { ...process.env, GIT_AUTHOR_NAME: 'CodeBucket', GIT_AUTHOR_EMAIL: 'noreply@codebucket.local', GIT_COMMITTER_NAME: 'CodeBucket', GIT_COMMITTER_EMAIL: 'noreply@codebucket.local' },
                });

                // 3. Clone it to a bare repository
                await execAsync(`git clone --bare . "${bareRepoPath}"`, { cwd: extractPath });

                // Clean up extracted files
                try {
                    fs.rmSync(extractPath, { recursive: true, force: true });
                } catch (cleanupErr) {
                    console.warn('Failed to clean up extract path after success:', cleanupErr);
                }
            } else {
                throw new InternalServerErrorException('Neither file nor githubUrl provided.');
            }

            // 4. Save metadata
            const repo = this.repositoryRepo.create({
                name,
                description,
                visibility,
                storagePath: bareRepoPath,
            });

            return await this.repositoryRepo.save(repo);
        } catch (e) {
            console.error('Error creating repository:', e);
            try {
                if (fs.existsSync(extractPath)) fs.rmSync(extractPath, { recursive: true, force: true });
            } catch (err) { }
            try {
                if (fs.existsSync(bareRepoPath)) fs.rmSync(bareRepoPath, { recursive: true, force: true });
            } catch (err) { }
            throw new InternalServerErrorException('Failed to process and initialize the repository.');
        }
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
        sort: string = 'createdAt',
        order: 'ASC' | 'DESC' = 'DESC'
    ): Promise<{ data: Repository[], total: number }> {
        const [data, total] = await this.repositoryRepo.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { [sort]: order },
        });
        return { data, total };
    }
}
