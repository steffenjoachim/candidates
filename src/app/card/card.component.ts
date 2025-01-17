import { Component, Input, Output, EventEmitter, input, Signal } from '@angular/core';
import { Candidate } from '../interfaces/voting.interface';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  candidate = input<Candidate | undefined>();
  isLoggedIn = input<boolean>(false);

  @Output() vote = new EventEmitter<{ id: string; newVotes: number }>();

  incrementVotes(): void {
    if (this.isLoggedIn()) {
      const candidate = this.candidate(); 
      if (candidate) {
        const newVotes = candidate.votes + 1;
        this.vote.emit({ id: candidate.id, newVotes });
      }
    }
  }
  
}
