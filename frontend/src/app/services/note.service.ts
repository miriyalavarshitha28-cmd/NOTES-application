import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private apiUrl =
    'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) {}

  getNotes(userId: string) {

    return this.http.get<any[]>(
      `${this.apiUrl}/notes/user/${userId}`
    );

  }

}