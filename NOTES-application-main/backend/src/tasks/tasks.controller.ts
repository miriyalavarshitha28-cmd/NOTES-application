import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { NotesService } from '../notes/notes.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly notesService: NotesService
  ) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.tasksService.findAllByUser(userId);
    }
    return this.tasksService.findAll();
  }

  @Get('combined')
  async combined(@Query('userId') userId?: string) {
    if (userId) {
      const [tasks, notes] = await Promise.all([
        this.tasksService.findAllByUser(userId),
        this.notesService.findAllByUser(userId),
      ]);
      return { tasks, notes };
    }

    const [tasks, notes] = await Promise.all([
      this.tasksService.findAll(),
      this.notesService.findAll(),
    ]);
    return { tasks, notes };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
