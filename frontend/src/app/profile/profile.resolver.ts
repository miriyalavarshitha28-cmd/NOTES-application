import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import {
  BackendService,
  User
} from '../services/backend.service';

export const profileResolver: ResolveFn<User | null> = () => {
  const backendService = inject(BackendService);

  if (typeof window === 'undefined') {
    return of(null);
  }

  const stored = localStorage.getItem('currentUser');

  if (!stored) {
    return of(null);
  }

  try {
    const currentUser = JSON.parse(stored);
    const userId = String(currentUser?.id || '');
    const email = String(currentUser?.email || '');

    if (userId) {
      return backendService
        .getUserById(userId)
        .pipe(catchError(() => of(null)));
    }

    if (email) {
      return backendService
        .getUserByEmail(email)
        .pipe(catchError(() => of(null)));
    }
  } catch {
    return of(null);
  }

  return of(null);
};
