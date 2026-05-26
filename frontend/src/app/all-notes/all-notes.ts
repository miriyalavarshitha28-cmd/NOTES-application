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

  loadingNotes = signal(false);

  hasMoreNotes = signal(true);

  readonly pageSize = 5;

  private currentUserId = '';

  private offset = 0;

  private loading = false;

  private hasMore = true;

  private lastScrollTop = 0;

  platformId = inject(PLATFORM_ID);

  constructor(
    private backendService: BackendService
  ) {
    console.log('AllNotesComponent initialized');
  }

  private sortNotesByUpdatedAt(notes: any[]) {
    return [...notes].sort((a, b) =>
      new Date(b?.updatedAt || 0).getTime() -
      new Date(a?.updatedAt || 0).getTime()
    );
  }

  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
      this.lastScrollTop = 0;
      this.loadInitialNotes();
    }

  }

  loadInitialNotes() {

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

    this.currentUserId = userId;
    this.offset = 0;
    this.hasMore = true;
    this.hasMoreNotes.set(true);
    this.lastScrollTop = 0;
    this.notes.set([]);
    this.loadMoreNotes();

  }

  loadMoreNotes() {

    if (!this.currentUserId || this.loading || !this.hasMore) {
      return;
    }

    this.loading = true;
    this.loadingNotes.set(true);

    this.backendService
      .getNotes(
        this.currentUserId,
        undefined,
        this.pageSize,
        this.offset
      )
      .subscribe({
        next: (notes) => {

          console.log('Notes loaded:', notes);

          this.notes.update(currentNotes =>
            this.sortNotesByUpdatedAt([
              ...currentNotes,
              ...notes
            ])
          );

          this.offset += notes.length;
          this.hasMore = notes.length === this.pageSize;
          this.hasMoreNotes.set(this.hasMore);
          this.loading = false;
          this.loadingNotes.set(false);

        },
        error: (err) => {

          console.error('Failed to load notes', err);
          this.loading = false;
          this.loadingNotes.set(false);

        }
      });

  }

  onNotesScroll(event: Event) {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const notesViewport =
      event.target as HTMLElement;

    const isScrollingDown =
      notesViewport.scrollTop > this.lastScrollTop;

    this.lastScrollTop =
      notesViewport.scrollTop;

    if (!isScrollingDown) {
      return;
    }

    const scrollPosition =
      notesViewport.scrollTop + notesViewport.clientHeight;

    const threshold =
      notesViewport.scrollHeight - 240;

    if (scrollPosition >= threshold) {
      this.loadMoreNotes();
    }

  }

  filteredNotes = computed(() => {

  const text =
    this.searchText()
      .trim()
      .toLowerCase();

  return this.notes().filter(note => {
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
        {
          const remainingNotes =
            notes.filter(note => note.id !== id);

          this.offset = remainingNotes.length;

          return remainingNotes;
        }
      );

    });

}

pinNote(note: any) {

  this.backendService
    .updateNote(note.id, {
      pinned: !note.pinned
    })
    .subscribe((updatedNote: any) => {

      this.notes.update(notes =>
        this.sortNotesByUpdatedAt(
          notes.map(n =>
            n.id === note.id
              ? {
                  ...n,
                  ...updatedNote,
                  pinned: Boolean(updatedNote?.pinned ?? !note.pinned)
                }
              : n
          )
        )
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
    .subscribe((updatedNote: any) => {

      this.notes.update(notes =>
        this.sortNotesByUpdatedAt(
          notes.map(n =>
            n.id === note.id
              ? {
                  ...n,
                  ...updatedNote,
                  title,
                  body
                }
              : n
          )
        )
      );

    });

}
  

}
