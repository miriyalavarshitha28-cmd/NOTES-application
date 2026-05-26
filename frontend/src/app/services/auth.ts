import { Injectable } from '@angular/core';

import {

  Auth,

  signInWithPopup,

  GoogleAuthProvider,

  signOut

} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  provider =
    new GoogleAuthProvider();

  constructor(
    private auth: Auth
  ) {}

  loginWithGoogle() {

    return signInWithPopup(
      this.auth,
      this.provider
    );

  }

  logout() {

    return signOut(this.auth);

  }

}