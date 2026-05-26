import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
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
    pinned: createNoteDto.pinned ?? false
  });

  return this.notesRepository.save(note);
}

  findAllByUser(
    userId: string,
    pinned?: string
  ) {
    const pinnedFilter =
      pinned === undefined
        ? {}
        : { pinned: pinned === 'true' };

    return this.notesRepository.find({
      where: {
        userId,
        deletedAt: IsNull(),
        ...pinnedFilter
      },
      order: {
        pinned: 'DESC',
        updatedAt: 'DESC'
      }
    });
  }

  findOne(id: string) {
    return this.notesRepository.findOne({ where: { id } });
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {

  await this.notesRepository.update(id, updateNoteDto);

  return this.findOne(id);
}


  async remove(id: string) {
    await this.notesRepository.update(
      id,
      {
        deletedAt: new Date()
      }
    );

    return this.findOne(id);
  }
}
