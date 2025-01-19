import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule, FormsModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent {
  email: string = '';
  password: string = '';
  isRegisterMode = signal(false);
  showSuccessMessage = signal(false);
  errorMessage = signal<string | null>(null);

  @Output() loginEvent = new EventEmitter<{
    email: string;
    password: string;
  }>();

  constructor(
    private auth: Auth,
    private firebaseService: FirebaseService,
    private authService: AuthService,
  ) {}

  open(isRegisterMode: boolean = false): void {
    this.isRegisterMode.set(isRegisterMode);
    this.email = '';
    this.password = '';
  }

  close(): void {
    this.email = '';
    this.password = '';
    this.loginEvent.emit(undefined);
  }

  toggleMode(): void {
    this.isRegisterMode.update((value) => !value);
  }

  async login(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage.set('Bitte Login-Daten eingeben.');
      return;
    }
    try {
      // logic for login ( uses Firebase Auth-Service)
      const userCredential = await this.authService.login(
        this.email,
        this.password,
      );
      this.errorMessage.set(null);
      this.close();
    } catch (error: any) {
      this.errorMessage.set(
        'Email und/oder Passwort ist falsch. Bitte prüfen!',
      );
    }
  }

  async register(): Promise<void> {
    const passwordError = this.validatePassword(this.password);
    if (passwordError) {
      this.errorMessage.set(passwordError);
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password,
      );
      await this.firebaseService.checkIfHasVoted(this.email);

      this.showSuccessMessage.set(true); // shows success message
      await this.auth.signOut(); // user is logged out after registration
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage.set('Diese E-Mail-Adresse wird bereits verwendet.');
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage.set('Die eingegebene E-Mail-Adresse ist ungültig.');
      } else if (error.code === 'auth/weak-password') {
        this.errorMessage.set(
          'Das Passwort ist zu schwach. Bitte verwenden Sie ein stärkeres Passwort.',
        );
      } else {
        this.errorMessage.set(
          'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
        );
        console.error('Fehler bei der Registrierung:', error);
      }
    }
  }

  private validatePassword(password: string): string | null {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < minLength) {
      return `Das Passwort muss mindestens ${minLength} Zeichen lang sein.`;
    }
    if (!hasUpperCase) {
      return 'Das Passwort muss mindestens einen Großbuchstaben enthalten.';
    }
    if (!hasLowerCase) {
      return 'Das Passwort muss mindestens einen Kleinbuchstaben enthalten.';
    }
    if (!hasNumber) {
      return 'Das Passwort muss mindestens eine Zahl enthalten.';
    }
    return null; // Validierung bestanden
  }

  onSubmit(): void {
    if (this.isRegisterMode()) {
      this.register();
    } else {
      this.login();
    }
  }

  closePopup(): void {
    this.showSuccessMessage.set(false);
    this.isRegisterMode.set(false);
    this.errorMessage.set(null);
  }
}
