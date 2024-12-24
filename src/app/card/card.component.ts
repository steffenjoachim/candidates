import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() id: string = ''; 
  @Input() name: string = ''; 
  @Input() img: string = ''; 
  @Input() votes!: number;
  @Output() vote = new EventEmitter<{ id: string; newVotes: number }>();

  incrementVotes(): void {
    const newVotes = this.votes + 1;
    this.vote.emit({ id: this.id, newVotes });
  }
}
