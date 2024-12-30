import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  imports: [
    CommonModule,
    FormsModule, 
    ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  @Output() login = new EventEmitter<{ email: string; password: string }>();
  @Output() register = new EventEmitter<{ email: string; password: string }>();
  @Output() closeDialog = new EventEmitter<void>();

  isRegisterMode = false;
  email = '';
  password = '';

  close(): void {
    this.closeDialog.emit();
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
  }

  onSubmit(): void {
    const credentials = { email: this.email, password: this.password };
    if (this.isRegisterMode) {
      this.register.emit(credentials);
    } else {
      this.login.emit(credentials);
    }
    this.closeDialog.emit(); // Dialog schließen
  }
}