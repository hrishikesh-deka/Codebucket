import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RepositoriesService } from './repositories.service';

@Controller('repositories')
export class RepositoriesController {
    constructor(private readonly repoService: RepositoriesService) { }

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
    async getRepositories() {
        return await this.repoService.findAll();
    }
}
