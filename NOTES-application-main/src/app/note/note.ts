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

  @Output() deleteEvent =
    new EventEmitter<string>();

  @Output() editEvent =
    new EventEmitter<any>();

  @Output() pinEvent =
    new EventEmitter<any>();

  isEditing = false;

  editedText = '';

  deleteNote() {
    this.deleteEvent.emit(this.note.id);
  }

  startEdit() {

    this.isEditing = true;

    this.editedText = this.note.text;
  }

  togglePin() {

    this.pinEvent.emit({

      ...this.note,

      pinned: !this.note.pinned

    });
  }

  saveEdit() {

    this.editEvent.emit({

      ...this.note,

      text: this.editedText

    });

    this.isEditing = false;
  }
}