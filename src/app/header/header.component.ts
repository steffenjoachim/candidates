import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { AuthService } from '../services/auth.service';
import { DialogComponent } from '../dialog/dialog/dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user$: Observable<User | null>; // Observable für den aktuellen Nutzer
  currentUser: User | null = null; // Der aktuelle Nutzerwert (abonnierter Wert)
  showLogin = false; // Zeigt den Dialog bei Bedarf an

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$; // Verbindung mit AuthService herstellen
  }

  ngOnInit(): void {
    // Abonniert den Wert von user$ und speichert ihn in currentUser
    this.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  // Klick-Handler für den Haupt-Button im Header
  onAuthButtonClick(user: User | null): void {
  if (user) {
    console.log('User logged in, logging out...');
    this.logout();
  } else {
    console.log('No user logged in, showing login dialog...');
    this.showLogin = true;
  }
}

  // Anmeldung über den Dialog
  async onLogin(credentials: { email: string; password: string }): Promise<void> {
    console.log('clicked')
    try {
      await this.authService.login(credentials.email, credentials.password);
      this.showLogin = false; // Dialog schließen
      console.log('Anmeldung erfolgreich!');
    } catch (error) {
      console.error('Fehler beim Anmelden:', error);
    }
  }

  // Registrierung über den Dialog
  async onRegister(credentials: { email: string; password: string }): Promise<void> {
    try {
      await this.authService.register(credentials.email, credentials.password);
      this.showLogin = false; // Dialog schließen
      console.log('Registrierung erfolgreich!');
    } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
    }
  }

  // Abmeldung
  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      console.log('Abmeldung erfolgreich!');
    } catch (error) {
      console.error('Fehler beim Abmelden:', error);
    }
  }
}
