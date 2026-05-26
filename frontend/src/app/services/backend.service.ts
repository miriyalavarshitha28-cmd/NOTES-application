
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Settings {
  id: string;
  userId: string;
  language?: string;
  notifications?: boolean;
  theme?: string;
  autosave?: string;
  privacy?: string;
  reminderEmails?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: Omit<User, 'password'>;
}

@Injectable({ providedIn: 'root' })
export class BackendService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  createUser(user: Omit<User, 'id'>) {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, { email, password });
  }

  getUserByEmail(email: string) {
    return this.http.get<User>(`${this.apiUrl}/users/email/${encodeURIComponent(email)}`);
  }

  getUserById(id: string) {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  updateUser(id: string, user: Partial<Omit<User, 'id' | 'password'>>) {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
  }

  getSettingsByUserId(userId: string) {
    return this.http.get<Settings>(`${this.apiUrl}/settings/user/${userId}`);
  }

  updateSettings(userId: string, settings: Partial<Omit<Settings, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) {
    return this.http.put<Settings>(`${this.apiUrl}/settings/user/${userId}`, settings);
  }

  getUsers() {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  createNote(note: {
  userId: string;
  title: string;
  body: string;
  pinned: boolean;
}) {
  return this.http.post(`${this.apiUrl}/notes`, note);
}

  getNotes(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/notes?userId=${userId}`);
  }

 updateNote(id: string, dto: {
  title?: string;
  body?: string;
  date?: string;
  pinned?: boolean;
}) {
  return this.http.put(`${this.apiUrl}/notes/${id}`, dto);
}

  deleteNote(id: string) {
    return this.http.delete(`${this.apiUrl}/notes/${id}`);
  }
}
