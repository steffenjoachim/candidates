import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Candidate } from '../interfaces/voting.interface';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() candidate!: Candidate;
  @Input() isLoggedIn = false; 
  @Output() vote = new EventEmitter<{ id: string; newVotes: number }>();

  incrementVotes(): void {
    if (this.isLoggedIn) {
      const newVotes = this.candidate.votes + 1;
      this.vote.emit({ id: this.candidate.id, newVotes });
    }
  }
}

