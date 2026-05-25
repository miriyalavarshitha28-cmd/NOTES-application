import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NoteComponent } from '../note/note';
import { AuthService } from '../services/auth';
import { BackendService } from '../services/backend.service';

interface Note {

  id: string;

  text: string;

  date: string;

  pinned: boolean;
}

@Component({
  selector: 'app-notes',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    NoteComponent,
    RouterModule,
    HttpClientModule
  ],

  templateUrl: './notes.html',

  styleUrls: ['./notes.css']
})

export class NotesComponent implements OnInit {

  darkMode = signal(true);

  notes = signal<Note[]>([]);

  currentUserId = '';

  currentUserEmail = '';

  currentUserName = '';

  noteMessage = '';

  newNote = '';

  searchText = '';

  toggleTheme() {
    this.darkMode.update(value => !value);
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private backendService: BackendService
  ) {
    const currentUser =
      typeof window !== 'undefined'
        ? localStorage.getItem('currentUser')
        : null;

    if (currentUser) {
      try {
        const parsed = JSON.parse(currentUser);
        this.currentUserId = parsed?.id || '';
        this.currentUserEmail = parsed?.email || '';
        this.currentUserName = parsed?.name || '';
      } catch {
        this.currentUserId = '';
        this.currentUserEmail = '';
        this.currentUserName = '';
      }
    }
  }

  private persistCurrentUser() {
    if (typeof window === 'undefined') {
      return;
    }

    const currentUser = {
      id: this.currentUserId || undefined,
      name: this.currentUserName || undefined,
      email: this.currentUserEmail || undefined
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  private async resolveCurrentUserId() {
    if (this.currentUserId) {
      return;
    }

    if (!this.currentUserEmail) {
      this.noteMessage = 'No user information found. Please login again.';
      return;
    }

    this.noteMessage = 'Finding your user profile...';

    this.backendService.getUserByEmail(this.currentUserEmail).subscribe({
      next: user => {
        if (user && (user as any).id) {
          this.currentUserId = (user as any).id;
          this.currentUserName = this.currentUserName || String((user as any).name || '');
          this.persistCurrentUser();
          this.loadNotes();
        } else {
          this.noteMessage = 'Unable to resolve your user account. Please login again.';
        }
      },
      error: err => {
        if (err?.status === 404) {
          this.createBackendUser();
        } else {
          this.noteMessage = 'Unable to resolve your user account. Please login again.';
        }
      }
    });
  }

  private createBackendUser(createNoteCallback?: () => void) {
    if (!this.currentUserEmail) {
      this.noteMessage = 'No user information found. Please login again.';
      return;
    }

    this.noteMessage = 'Creating your profile so notes can be saved...';
    const name = this.currentUserName || this.currentUserEmail.split('@')[0];

    this.backendService
      .createUser({
        name,
        email: this.currentUserEmail,
        password: ''
      })
      .subscribe({
        next: user => {
          this.currentUserId = (user as any).id;
          this.currentUserName = this.currentUserName || String((user as any).name || '');
          this.persistCurrentUser();
          this.loadNotes();
          if (createNoteCallback) {
            createNoteCallback();
          }
        },
        error: err => {
          console.error('Create backend user failed', err);
          this.noteMessage = 'Unable to create your profile. Please login again.';
        }
      });
  }

  private loadNotes() {
    if (!this.currentUserId) {
      return;
    }

    this.noteMessage = '';

    this.backendService.getNotes(this.currentUserId).subscribe({
      next: notes => {
        this.notes.set(notes.map(note => this.mapNote(note)));
      },
      error: () => {
        this.noteMessage = 'Unable to load notes. Please try again later.';
      }
    });
  }

  private mapNote(note: any): Note {
    return {
      id: String(note?.id),
      text: String(note?.text ?? ''),
      date: String(note?.date ?? new Date().toLocaleString()),
      pinned: Boolean(note?.pinned ?? false)
    };
  }

  addNote() {
    if (!this.newNote.trim()) {
      return;
    }

    this.noteMessage = '';

    const createNoteForUser = (userId: string) => {
      this.backendService
        .createNote({
          userId,
          text: this.newNote,
          date: new Date().toLocaleString(),
          pinned: false
        })
        .subscribe({
          next: note => {
            this.notes.update(notes => [...notes, this.mapNote(note)]);
            this.newNote = '';
            this.noteMessage = '';
          },
          error: err => {
            console.error('Add note failed', err);
            this.noteMessage = 'Unable to add note. Please try again.';
          }
        });
    };

    if (this.currentUserId) {
      createNoteForUser(this.currentUserId);
      return;
    }

    if (!this.currentUserEmail) {
      this.noteMessage = 'No user found. Please login again before adding notes.';
      return;
    }

    this.noteMessage = 'Finding your user profile...';

    this.backendService.getUserByEmail(this.currentUserEmail).subscribe({
      next: user => {
        if (user && (user as any).id) {
          this.currentUserId = (user as any).id;
          this.persistCurrentUser();
          createNoteForUser(this.currentUserId);
        } else {
          this.createBackendUser(() => {
            if (this.currentUserId) {
              createNoteForUser(this.currentUserId);
            }
          });
        }
      },
      error: err => {
        console.error('Resolve current user failed', err);
        if (err?.status === 404) {
          this.createBackendUser(() => {
            if (this.currentUserId) {
              createNoteForUser(this.currentUserId);
            }
          });
        } else {
          this.noteMessage = 'Unable to find your user profile. Please login again.';
        }
      }
    });
  }

  deleteNote(id: string) {
    if (!id) {
      return;
    }

    this.backendService.deleteNote(id).subscribe({
      next: () => {
        this.notes.update(notes => notes.filter(note => note.id !== id));
      }
    });
  }

  editNote(updatedNote: Note) {
    if (!updatedNote.id) {
      return;
    }

    this.backendService
      .updateNote(updatedNote.id, {
        text: updatedNote.text,
        date: updatedNote.date,
        pinned: updatedNote.pinned
      })
      .subscribe({
        next: () => {
          this.notes.update(notes =>
            notes.map(note =>
              note.id === updatedNote.id ? updatedNote : note
            )
          );
        }
      });
  }

  filteredNotes() {
    return [...this.notes()]
      .filter(note =>
        String(note.text || '')
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      )
      .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }

  togglePin(updatedNote: Note) {
    if (!updatedNote.id) {
      return;
    }

    const toggledNote = { ...updatedNote, pinned: !updatedNote.pinned };

    this.backendService
      .updateNote(toggledNote.id, { pinned: toggledNote.pinned })
      .subscribe({
        next: () => {
          this.notes.update(notes =>
            notes.map(note =>
              note.id === toggledNote.id ? toggledNote : note
            )
          );
        }
      });
  }

  ngOnInit() {
    if (typeof window === 'undefined') {
      return;
    }

    this.noteMessage = '';

    if (this.currentUserId) {
      this.loadNotes();
    } else if (this.currentUserEmail) {
      this.resolveCurrentUserId();
    }
  }

  searchNotes() {
    this.noteMessage = '';
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('currentUser');
    }

    this.authService.logout().catch(() => {
      // If Firebase logout fails, still navigate away and clear local state.
    });

    this.router.navigate(['/']);
  }

}