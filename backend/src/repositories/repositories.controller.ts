import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    NotFoundException,
    Get,
    Query,
    Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RepositoriesService } from './repositories.service';
import { FileViewerService } from './file-viewer.service';

@Controller('repositories')
export class RepositoriesController {
    constructor(
        private readonly repoService: RepositoriesService,
        private readonly fileViewerService: FileViewerService
    ) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadRepository(
        @UploadedFile() file: Express.Multer.File | undefined,
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('visibility') visibility: string,
        @Body('owner') owner: string,
        @Body('githubUrl') githubUrl: string,
    ) {
        if (!file && !githubUrl) {
            throw new BadRequestException('A zip file or a GitHub URL is required.');
        }
        if (!name) {
            throw new BadRequestException('Repository name is required.');
        }

        return await this.repoService.createRepository(
            name,
            description || '',
            visibility || 'public',
            owner || 'unknown',
            file,
            githubUrl,
        );
    }

    @Get()
    async getRepositories(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('sort') sort?: string,
        @Query('order') order?: string,
    ) {
        const parsedPage = page ? parseInt(page, 10) : 1;
        const parsedLimit = limit ? parseInt(limit, 10) : 10;
        const parsedSort = sort || 'createdAt';
        const parsedOrder = (order === 'DESC' || order === 'desc') ? 'DESC' : 'ASC';

        return await this.repoService.findAll(parsedPage, parsedLimit, parsedSort, parsedOrder as 'ASC' | 'DESC');
    }

    @Get(':id')
    async getRepository(@Param('id') id: string) {
        // Find using the paginated service
        const result = await this.repoService.findAll(1, 1000);

        // Handle both older array format and newer nested data format
        const reposArray = Array.isArray(result) ? result : (result.data || []);

        const repo = reposArray.find(r => r.id === id);
        if (!repo) {
            throw new NotFoundException('Repository not found');
        }
        return repo;
    }

    @Get(':id/tree')
    async getRepositoryTreeRoot(@Param('id') id: string) {
        return this.getRepositoryTree({ '*': '' }, id);
    }

    @Get(':id/tree/*')
    async getRepositoryTree(@Param() params: Record<string, any>, @Param('id') id: string) {
        let path = params['*'] || params[0] || params['0'] || params.path || '';
        if (Array.isArray(path)) {
            path = path.join('/');
        }

        const repo = await this.getRepository(id);
        if (!repo || !repo.storagePath) throw new NotFoundException('Repository not found');

        return await this.fileViewerService.getTree(repo.storagePath, 'HEAD', path || '');
    }

    @Get(':id/blob/*')
    async getRepositoryBlob(@Param() params: Record<string, any>, @Param('id') id: string) {
        let path = params['*'] || params[0] || params['0'] || params.path || '';
        if (Array.isArray(path)) {
            path = path.join('/');
        }

        const repo = await this.getRepository(id);
        if (!repo || !repo.storagePath) throw new NotFoundException('Repository not found');

        if (!path) throw new BadRequestException('File path is required');

        const content = await this.fileViewerService.getFileContent(repo.storagePath, 'HEAD', path);
        return { content };
    }
}
