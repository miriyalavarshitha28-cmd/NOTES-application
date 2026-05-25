import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';

import { SignupComponent } from './signup/signup';


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
  loadComponent: () =>
    import('./notes/notes')
      .then(m => m.NotesComponent)
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