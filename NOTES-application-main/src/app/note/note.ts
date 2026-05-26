import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './note.html',
  styleUrls: ['./note.css']
})
export class NoteComponent {

  @Input() note: any;

  @Output()
  deleteEvent = new EventEmitter<string>();

  @Output()
  editEvent = new EventEmitter<any>();

  @Output()
  pinEvent = new EventEmitter<any>();

  isEditing = false;

  editedTitle = '';

  editedBody = '';

  deleteNote() {
    this.deleteEvent.emit(this.note.id);
  }

  startEdit() {
    this.isEditing = true;

    this.editedTitle = this.note.title;

    this.editedBody = this.note.body;
  }

 togglePin() {

  const updatedNote = {
    ...this.note,
    pinned: !this.note.pinned
  };

  this.pinEvent.emit(updatedNote);

}

  saveEdit() {
    this.editEvent.emit({
      ...this.note,
      title: this.editedTitle,
      body: this.editedBody
    });

    this.isEditing = false;
  }
}