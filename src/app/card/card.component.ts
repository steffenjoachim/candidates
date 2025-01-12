import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() id: string = ''; 
  @Input() name: string = ''; //candidate name
  @Input() img: string = ''; 
  @Input() votes!: number;
  @Input() isLoggedIn = false; 
  @Output() vote = new EventEmitter<{ id: string; newVotes: number }>();

  incrementVotes(): void {
    if (this.isLoggedIn) {
      const newVotes = this.votes + 1;
      this.vote.emit({ id: this.id, newVotes });
    }
  }
}

