import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

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
  imports: [RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  profile: UserProfile = {
    fullName: 'Your Name',
    email: 'you@example.com',
    username: 'yourusername',
    plan: 'Free',
    joined: 'May 2026',
    favoriteColor: 'Blue'
  };

  constructor() {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
  if (typeof window === 'undefined') {
    return;
  }

  const stored = localStorage.getItem('currentUser');
  if (!stored) {
    return;
  }

  const joinedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  try {
    const data = JSON.parse(stored);

    const name = String(data?.name || 'Your Name');
    const email = String(data?.email || 'you@example.com');

    const username = data?.name
      ? String(data.name).toLowerCase().replace(/\s+/g, '.')
      : email.split('@')[0];

    this.profile = {
      fullName: name,
      email,
      username,
      plan: 'Free',
      joined: joinedDate,
      favoriteColor: 'Blue'
    };

  } catch {

    const name = String(stored || 'Your Name');
    const username = name.toLowerCase().replace(/\s+/g, '.');

    this.profile = {
      fullName: name,
      email: 'you@example.com',
      username,
      plan: 'Free',
      joined: joinedDate,
      favoriteColor: 'Blue'
    };
  }
}
}
