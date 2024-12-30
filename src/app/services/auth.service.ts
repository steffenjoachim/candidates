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
    // Beobachtet Benutzerstatus
    this.user$ = new Observable((observer) => {
      onAuthStateChanged(this.auth, (user) => observer.next(user));
    });
  }

  // Benutzer anmelden
  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Erfolgreich angemeldet!');
    } catch (error) {
      console.error('Fehler beim Anmelden:', error);
      throw error;
    }
  }

  // Benutzer registrieren
  async register(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('Erfolgreich registriert!');
    } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
      throw error;
    }
  }

  // Benutzer abmelden
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('Erfolgreich abgemeldet!');
    } catch (error) {
      console.error('Fehler beim Abmelden:', error);
      throw error;
    }
  }
}

