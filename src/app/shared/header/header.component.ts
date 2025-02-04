import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { DialogComponent } from '../../core/home/components/dialog/dialog.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, DialogComponent],
})
export class HeaderComponent implements OnInit {
  user$: Observable<User | null>;
  currentUser: User | null = null;
  showLogin = signal(false);
  showLogout = signal(false);

  private cdr = inject(ChangeDetectorRef); // Inject ChangeDetectorRef

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      this.currentUser = user;
      this.cdr.detectChanges(); // Trigger view update manually
    });
  }

  // opens the dialog component
  onAuthButtonClick(user: User | null): void {
    if (user) {
      this.logout();
    } else {
      //ensures that app dialog becomes visible
      this.showLogin.set(true);
      this.showLogout.set(true);
    }
  }

  async onLogin(
    credentials: { email: string; password: string } | undefined,
  ): Promise<void> {
    try {
      if (credentials) {
        await this.authService.login(credentials.email, credentials.password);
      }
      this.showLogin.set(false);
      this.cdr.detectChanges(); // Update view after login
    } catch (error) {
      console.error('Fehler beim Anmelden:', error);
    }
    this.showLogout.set(false);
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Fehler beim Abmelden:', error);
    }
  }
}
