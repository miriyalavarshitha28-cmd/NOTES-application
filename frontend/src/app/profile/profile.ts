import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BackendService, User } from '../services/backend.service';

interface UserProfile {
  fullName: string;
  email: string;
  username: string;
  plan: string;
  joined: string;
  favoriteColor: string;
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
    email: '',
    username: '',
    plan: 'Free',
    joined: '',
    favoriteColor: 'Blue'
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
        email: this.profile.email,
        username: this.profile.username,
        plan: this.profile.plan,
        joined: this.profile.joined,
        favoriteColor: this.profile.favoriteColor
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
    const joinedDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });

    this.profile = {
      fullName: name,
      email,
      username:
        user?.username ||
        (name ? name.toLowerCase().replace(/\s+/g, '.') : email.split('@')[0]),
      plan: user?.plan || 'Free',
      joined: user?.joined || joinedDate,
      favoriteColor: user?.favoriteColor || 'Blue'
    };
  }
}
