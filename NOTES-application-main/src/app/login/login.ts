import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  username = '';

  password = '';

  errorMessage = '';

  isGoogleSigningIn = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private backendService: BackendService
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.backendService.login(this.username, this.password).subscribe({
      next: response => {
        if (response.success && response.user) {
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              id: response.user.id,
              name: response.user.name,
              email: response.user.email
            })
          );
          this.router.navigate(['/notes']);
        } else {
          this.errorMessage = response.message || 'Invalid Email or Password';
        }
      },
      error: err => {
        this.errorMessage =
          err?.error?.message || 'Login failed. Try again.';
      }
    });
  }

  googleLogin() {
    if (this.isGoogleSigningIn) {
      return;
    }

    this.isGoogleSigningIn = true;
    this.errorMessage = '';

    this.authService
      .loginWithGoogle()
      .then(result => {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem(
          'currentUser',
          JSON.stringify({
            name: result.user.displayName || 'Google User',
            email: result.user.email || ''
          })
        );
        this.router.navigate(['/notes']);
      })
      .catch(error => {
        console.error(error);
        if (error?.code === 'auth/popup-blocked') {
          this.errorMessage =
            'Popup blocked by the browser. Allow popups for localhost and try again.';
        } else if (error?.code === 'auth/cancelled-popup-request') {
          this.errorMessage =
            'You closed the sign-in popup or another sign-in request was cancelled. Try again.';
        } else {
          this.errorMessage =
            'Google sign-in failed. Please try again or use email login.';
        }
      })
      .finally(() => {
        this.isGoogleSigningIn = false;
      });
  }

  goToSignup() {

    this.router.navigate(['/signup']);

  }

}