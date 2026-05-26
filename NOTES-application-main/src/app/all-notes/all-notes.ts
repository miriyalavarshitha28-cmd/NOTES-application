import {
  Component,
  signal,
  computed,
  PLATFORM_ID,
  inject,
  OnInit
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { FormsModule } from '@angular/forms';

import { RouterLink } from '@angular/router';

import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-all-notes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './all-notes.html',
  styleUrls: ['./all-notes.css']
})
export class AllNotesComponent implements OnInit {

  notes = signal<any[]>([]);

  searchText = signal('');

  platformId = inject(PLATFORM_ID);

  constructor(
    private backendService: BackendService
  ) {
    console.log('AllNotesComponent initialized');
  }

  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {
      this.loadNotes();
    }

  }

  loadNotes() {

    if (typeof localStorage === 'undefined') {
      return;
    }

    const currentUser =
      JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );

    const userId = currentUser.id;

    if (!userId) {
      console.log('No user found');
      return;
    }

    this.backendService
      .getNotes(userId)
      .subscribe({
        next: (notes) => {

          console.log('Notes loaded:', notes);

          this.notes.set(notes);

        },
        error: (err) => {

          console.error('Failed to load notes', err);

        }
      });

  }

  filteredNotes = computed(() => {

  const text =
    this.searchText()
      .trim()
      .toLowerCase();

  return this.notes().filter(note => {

    if (note.pinned) {
      return false;
    }

    if (!text) {
      return true;
    }

    return (
      note.title
        .toLowerCase()
        .includes(text)
      ||
      note.body
        .toLowerCase()
        .includes(text)
    );

  });

});
deleteNote(id: string) {

  this.backendService
    .deleteNote(id)
    .subscribe(() => {

      this.notes.update(notes =>
        notes.filter(note => note.id !== id)
      );

    });

}

pinNote(note: any) {

  this.backendService
    .updateNote(note.id, {
      pinned: true
    })
    .subscribe(() => {

      this.notes.update(notes =>
        notes.filter(n => n.id !== note.id)
      );

    });

}

editNote(note: any) {

  const title =
    prompt('Edit title', note.title);

  const body =
    prompt('Edit body', note.body);

  if (!title || !body) {
    return;
  }

  this.backendService
    .updateNote(note.id, {
      title,
      body
    })
    .subscribe(() => {

      this.notes.update(notes =>
        notes.map(n =>
          n.id === note.id
            ? {
                ...n,
                title,
                body
              }
            : n
        )
      );

    });

}
  

}