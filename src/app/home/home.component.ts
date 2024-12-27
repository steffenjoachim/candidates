import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { CardComponent } from '../card/card.component';
import { FooterComponent } from '../footer/footer.component';
import { FirebaseService } from '../services/firebase.service';

interface Candidate {
  id: string;
  name: string;
  img: string;
  votes: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    CardComponent,
  ],
})
export class HomeComponent implements OnInit {
  candidates: Candidate[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    console.log(this.firebaseService.loadAllCandidates().subscribe((candidates: Candidate[]) => {
      this.candidates = candidates;
    }))
    // Alle Kandidaten laden, wenn die Komponente initialisiert wird
    this.firebaseService.loadAllCandidates().subscribe((candidates: Candidate[]) => {
      this.candidates = candidates;
    });
  }

  // Methode, die aufgerufen wird, wenn ein Kandidat gevotet wurde
  onVoteUpdated({ id, newVotes }: { id: string; newVotes: number }): void {
    this.firebaseService.updateVotes(id, newVotes)
      .then(() => {
        // Lokale Liste der Kandidaten aktualisieren (optional)
        const candidate = this.candidates.find((c) => c.id === id);
        if (candidate) {
          candidate.votes = newVotes;
        }
      })
      .catch((error) => {
        console.error('Fehler beim Aktualisieren der Stimmen:', error);
      });
  }
}
