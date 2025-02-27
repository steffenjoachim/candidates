import { Component, input, output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.css']
})
export class SuccessPopupComponent {
  votedCandidateName = input.required<string>();
  closePopupEvent = output<'success' | 'alreadyVoted' | 'doubleVoted'>();

  closePopup(popupType: 'success' | 'alreadyVoted' | 'doubleVoted'): void {
    this.closePopupEvent.emit(popupType);
  }
}