import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { DialogComponent } from '../dialog/dialog/dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [ CommonModule, 
             DialogComponent ]
})
export class HeaderComponent implements OnInit {
  user$: Observable<User | null>;
  currentUser: User | null = null;
  showLogin = signal(false);

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  onAuthButtonClick(user: User | null): void {
    if (user) {
      this.logout();
    } else {
      this.showLogin.set(true);
    }
  }

  async onLogin(credentials: { email: string; password: string }): Promise<void> {
    try {
      await this.authService.login(credentials.email, credentials.password);
      this.showLogin.set(false);
    } catch (error) {
      console.error('Fehler beim Anmelden:', error);
    }
  }

  // async onRegister(credentials: { email: string; password: string }): Promise<void> {
  //   try {
  //     await this.authService.register(credentials.email, credentials.password);
  //     await this.firebaseService.checkIfHasVoted(credentials.email);
  //     console.log('Hi')
  //     this.showLogin.set(false);
  //   } catch (error) {
  //     console.error('Fehler bei der Registrierung:', error);
  //   }
  // }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Fehler beim Abmelden:', error);
    }
  }
}
