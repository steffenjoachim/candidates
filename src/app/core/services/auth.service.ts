import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    // watches user status
    this.user$ = new Observable((observer) => {
      onAuthStateChanged(this.auth, (user) => observer.next(user));
    });
  }

  // user login
  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Fehler beim Anmelden:', error);
      throw error;
    }
  }

  // register user
  async register(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
      throw error;
    }
  }

  // user logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Fehler beim Abmelden:', error);
      throw error;
    }
  }
}

