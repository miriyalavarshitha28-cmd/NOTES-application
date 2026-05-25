import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';

import { SignupComponent } from './signup/signup';

import { NotesComponent } from './notes/notes';

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
    path: 'notes',
    component: NotesComponent
  },

  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then(m => m.ProfileComponent)
  },

  {
    path: 'settings',
    loadComponent: () => import('./settings/settings').then(m => m.SettingsComponent)
  }

];