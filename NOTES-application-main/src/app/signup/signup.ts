import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  message = '';

  constructor(
    private router: Router,
    private backendService: BackendService
  ) {}

  signup() {
    if (!this.name || !this.email || !this.password) {
      this.message = 'Please fill all fields';
      return;
    }

    this.backendService
      .createUser({
        name: this.name,
        email: this.email,
        password: this.password
      })
      .subscribe({
        next: user => {
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              id: user.id,
              name: user.name,
              email: user.email
            })
          );
          this.message = 'Signup Successful';
          setTimeout(() => this.router.navigate(['/notes']), 600);
        },
        error: err => {
          this.message =
            err?.error?.message || 'Signup failed. Try again.';
        }
      });
  }
}