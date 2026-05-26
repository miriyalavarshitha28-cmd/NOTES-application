import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BackendService, User } from '../services/backend.service';

interface UserProfile {
  fullName: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile = {
    fullName: '',
    email: ''
  };

  userId = '';
  message = '';
  isSaving = false;

  constructor(private backendService: BackendService) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = localStorage.getItem('currentUser');
    if (!stored) {
      this.message = 'Please login again to load your profile.';
      return;
    }

    try {
      const currentUser = JSON.parse(stored);
      this.userId = String(currentUser?.id || '');

      if (!this.userId) {
        this.message = 'Please login again to load your profile.';
        return;
      }

      this.backendService.getUserById(this.userId).subscribe({
        next: user => this.setProfileFromUser(user),
        error: () => {
          this.setProfileFromUser(currentUser);
          this.message = 'Showing saved login details. Backend profile could not be loaded.';
        }
      });
    } catch {
      this.message = 'Please login again to load your profile.';
    }
  }

  saveProfile() {
    if (!this.userId) {
      this.message = 'Please login again before saving your profile.';
      return;
    }

    this.isSaving = true;
    this.message = '';

    this.backendService
      .updateUser(this.userId, {
        name: this.profile.fullName,
        email: this.profile.email
      })
      .subscribe({
        next: user => {
          this.setProfileFromUser(user);
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              id: user.id,
              name: user.name,
              email: user.email
            })
          );
          this.message = 'Profile saved successfully.';
          this.isSaving = false;
        },
        error: err => {
          this.message =
            err?.error?.message || 'Profile could not be saved. Please try again.';
          this.isSaving = false;
        }
      });
  }

  private setProfileFromUser(user: Partial<User>) {
    const name = String(user?.name || '');
    const email = String(user?.email || '');

    this.profile = {
      fullName: name,
      email
    };
  }
}
