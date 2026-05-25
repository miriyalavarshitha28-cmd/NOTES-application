import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent {
  settings = {
    language: 'English',
    notifications: true,
    darkMode: 'Enabled',
    autosave: 'On',
    privacy: 'Standard',
    reminderEmails: true
  };
}
