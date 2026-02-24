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
        @UploadedFile() file: Express.Multer.File,
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('visibility') visibility: string,
    ) {
        if (!file) {
            throw new BadRequestException('A zip file is required.');
        }
        if (!name) {
            throw new BadRequestException('Repository name is required.');
        }

        return await this.repoService.createRepository(
            name,
            description || '',
            visibility || 'public',
            file,
        );
    }

    @Get()
    async getRepositories() {
        return await this.repoService.findAll();
    }
}
