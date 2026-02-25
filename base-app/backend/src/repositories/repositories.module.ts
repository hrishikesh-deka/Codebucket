import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';
import { FileViewerService } from './file-viewer.service';
import { Repository } from './repository.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Repository])],
  controllers: [RepositoriesController],
  providers: [RepositoriesService, FileViewerService]
})
export class RepositoriesModule { }
