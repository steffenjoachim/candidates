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
  isDialogVisible = signal(false);
  showSuccessMessage = signal(false);

  @Output() loginEvent = new EventEmitter<{
    email: string;
    password: string;
  }>();

  constructor(private auth: Auth,
              private firebaseService: FirebaseService
  ) {}

  open(isRegisterMode: boolean = false): void {
    this.isDialogVisible.set(true); 
    this.isRegisterMode.set(true);
    this.email = ''; 
    this.password = '';
  }

  close(): void {
    this.isDialogVisible.set(false); 
    this.email = ''; 
    this.password = '';
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
      this.showSuccessMessage.set(true); 
    } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
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
  }
}
