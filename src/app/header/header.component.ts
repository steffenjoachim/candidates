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
  user$: Observable<User | null>; // observable for current user
  currentUser: User | null = null; // the current user valu (subscribed value)
  showLogin = false; // shows the dialog if needed

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$; // Verbindung mit AuthService herstellen
  }

  ngOnInit(): void {
    // subscribes user$ and sores it in currentUser
    this.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  //click handler for the main btn in header
  onAuthButtonClick(user: User | null): void {
  if (user) {
    this.logout();
  } else {
    this.showLogin = true; // dialog will be shown
  }
}

  // login via dialog
  async onLogin(credentials: { email: string; password: string }): Promise<void> {
    try {
      await this.authService.login(credentials.email, credentials.password);
      this.showLogin = false; // close dialog
    } catch (error) {
      console.error('Fehler beim Anmelden:', error);
    }
  }

  // registration via dialog
  async onRegister(credentials: { email: string; password: string }): Promise<void> {
    try {
      await this.authService.register(credentials.email, credentials.password);
      this.showLogin = false; // close dialog
    } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
    }
  }

  // checkout
  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Fehler beim Abmelden:', error);
    }
  }
}
