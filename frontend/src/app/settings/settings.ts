import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
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
    darkMode: 'Enabled',
    autosave: 'On',
    privacy: 'Standard',
    reminderEmails: true
  };

  theme = 'dark';

  ngOnInit() {

    const savedTheme =
      localStorage.getItem('theme');

    if (savedTheme) {
      this.theme = savedTheme;
    }

  }

  saveTheme() {

    localStorage.setItem(
      'theme',
      this.theme
    );

    this.settings.darkMode =
      this.theme === 'dark'
        ? 'Enabled'
        : 'Disabled';

    alert(
      `Theme changed to ${this.theme} mode`
    );

  }

}