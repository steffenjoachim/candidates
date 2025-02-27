import {
  Component,
  output,
  input,
} from '@angular/core';
import { Candidate } from '../../../interfaces/candidate.interface';

@Component({
  selector: 'app-chancellor-candidate-card',
  templateUrl: './chancellor-candidate.card.component.html',
  styleUrls: ['./chancellor-candidate.card.component.css'],
})
export class ChancellorCandidateCardComponent {
  candidate = input.required<Candidate>();
  isLoggedIn = input<boolean>(false);

  vote = output<{ id: string; newVotes: number }>();

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
