import { Component, Input, Output, EventEmitter, input, Signal } from '@angular/core';
import { Candidate } from '../interfaces/voting.interface';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  candidate = input<Candidate>({ id: '', name: '', img: '', votes: 0 });
  isLoggedIn = input<boolean>(false);

  @Output() vote = new EventEmitter<{ id: string; newVotes: number }>();
}
