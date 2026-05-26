import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>
  ) {}

  create(createNoteDto: CreateNoteDto) {
  const note = this.notesRepository.create({
    userId: createNoteDto.userId,
    title: createNoteDto.title,
    body: createNoteDto.body,
    date: createNoteDto.date,
    pinned: createNoteDto.pinned
  });

  return this.notesRepository.save(note);
}

  findAllByUser(userId: string) {
    return this.notesRepository.find({ where: { userId } });
  }

  findOne(id: string) {
    return this.notesRepository.findOne({ where: { id } });
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    await this.notesRepository.update(id, updateNoteDto);
    return this.findOne(id);
  }


  remove(id: string) {
    return this.notesRepository.delete(id);
  }
}
