import { Component, EventEmitter, Output, signal } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Auth,createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FirebaseService } from '../../services/firebase.service';

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

  constructor(private auth: Auth,
              private firebaseService: FirebaseService
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
    this.isRegisterMode.update(value => !value);
  }  

  login(): void {
    const credentials = { email: this.email, password: this.password };
    this.loginEvent.emit(credentials); 
  }
  
  async register(): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      await this.firebaseService.checkIfHasVoted(this.email);
  
      this.showSuccessMessage.set(true); // shows success message
      await this.auth.signOut(); // user is logged out after registration
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage.set('Diese E-Mail-Adresse wird bereits verwendet.');
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage.set('Die eingegebene E-Mail-Adresse ist ungültig.');
      } else if (error.code === 'auth/weak-password') {
        this.errorMessage.set('Das Passwort ist zu schwach. Bitte verwenden Sie ein stärkeres Passwort.');
      } else {
        this.errorMessage.set('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        console.error('Fehler bei der Registrierung:', error);
      }
    }
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
