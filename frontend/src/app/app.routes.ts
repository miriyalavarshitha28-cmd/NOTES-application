import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';

import { SignupComponent } from './signup/signup';

import { AllNotesComponent } from './all-notes/all-notes';
import { NotesComponent } from './notes/notes';
import { profileResolver } from './profile/profile.resolver';



export const routes: Routes = [

  {
    path: '',
    component: LoginComponent
  },

  {
    path: 'signup',
    component: SignupComponent
  },
  {
  path: 'all-notes',
  loadComponent: () =>
    import('./all-notes/all-notes')
      .then(m => m.AllNotesComponent)
},

 {
  path: 'notes',
  loadComponent: () =>
    import('./notes/notes')
      .then(m => m.NotesComponent)
 },

  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then(m => m.ProfileComponent),
    resolve: {
      profile: profileResolver
    }
  },

  {
    path: 'settings',
    loadComponent: () => import('./settings/settings').then(m => m.SettingsComponent)
  }

];
