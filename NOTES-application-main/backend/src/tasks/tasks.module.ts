import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { NotesModule } from '../notes/notes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), NotesModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
