import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { User } from '../services/backend.service';

interface UserProfile {
  userName: string;
  userEmail: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile = {
    userName: '',
    userEmail: '',
    userId: ''
  };

  userId = '';
  message = '';
  isLoading = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const user = this.route.snapshot.data['profile'] as User | null;

    if (!user) {
      this.isLoading = false;
      this.message = 'Please login again to load your profile.';
      return;
    }

    this.setProfileFromUser(user);
  }

  private setProfileFromUser(user: User) {
    this.userId = String(user.id || '');

    this.profile = {
      userName: String(user.name || ''),
      userEmail: String(user.email || ''),
      userId: this.userId,
      createdAt: user?.createdAt
        ? new Date(user.createdAt).toLocaleString()
        : '',
      updatedAt: user?.updatedAt
        ? new Date(user.updatedAt).toLocaleString()
        : ''
    };

    this.isLoading = false;

    if (!this.profile.userName || !this.profile.userEmail) {
      this.message = 'Backend profile was loaded, but name or email is missing from the user record.';
    } else {
      this.message = '';
    }
  }
}
