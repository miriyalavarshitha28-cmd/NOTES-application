import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BackendService, Settings } from '../services/backend.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent implements OnInit {

  settings = {
    language: 'English',
    notifications: true,
    autosave: 'On',
    privacy: 'Standard',
    reminderEmails: true
  };

  theme = 'dark';
  userId = '';
  message = '';
  isSaving = false;
  createdAt = '';
  updatedAt = '';

  constructor(private backendService: BackendService) {}

  ngOnInit() {
    this.loadSettings();
  }

  saveSettings() {
    if (!this.userId) {
      this.message = 'Please login again before saving settings.';
      return;
    }

    this.isSaving = true;
    this.message = '';

    this.backendService
      .updateSettings(this.userId, {
        language: this.settings.language,
        notifications: this.settings.notifications,
        theme: this.theme,
        autosave: this.settings.autosave,
        privacy: this.settings.privacy,
        reminderEmails: this.settings.reminderEmails
      })
      .subscribe({
        next: settings => {
          this.setSettings(settings);
          localStorage.setItem('theme', this.theme);
          this.message = 'Settings saved successfully.';
          this.isSaving = false;
        },
        error: err => {
          this.message =
            err?.error?.message || 'Settings could not be saved. Please try again.';
          this.isSaving = false;
        }
      });
  }

  private loadSettings() {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = localStorage.getItem('currentUser');
    if (!stored) {
      this.message = 'Please login again to load settings.';
      return;
    }

    try {
      const currentUser = JSON.parse(stored);
      this.userId = String(currentUser?.id || '');

      if (!this.userId) {
        this.message = 'Please login again to load settings.';
        return;
      }

      this.backendService.getSettingsByUserId(this.userId).subscribe({
        next: settings => this.setSettings(settings),
        error: () => {
          const savedTheme = localStorage.getItem('theme');

          if (savedTheme) {
            this.theme = savedTheme;
          }

          this.message = 'Backend settings could not be loaded.';
        }
      });
    } catch {
      this.message = 'Please login again to load settings.';
    }
  }

  private setSettings(settings: Partial<Settings>) {
    this.settings = {
      language: settings?.language || 'English',
      notifications: settings?.notifications ?? true,
      autosave: settings?.autosave || 'On',
      privacy: settings?.privacy || 'Standard',
      reminderEmails: settings?.reminderEmails ?? true
    };

    this.theme = settings?.theme || localStorage.getItem('theme') || 'dark';
    this.createdAt = settings?.createdAt
      ? new Date(settings.createdAt).toLocaleString()
      : '';
    this.updatedAt = settings?.updatedAt
      ? new Date(settings.updatedAt).toLocaleString()
      : '';
  }

}
