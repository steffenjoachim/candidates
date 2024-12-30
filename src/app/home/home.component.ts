import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { CardComponent } from '../card/card.component';
import { FooterComponent } from '../footer/footer.component';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';

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
  isLoggedIn = false;

  constructor(private firebaseService: FirebaseService,
              private authService: AuthService
  ) {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user; // Prüfen, ob ein User angemeldet ist
    });
  }

  ngOnInit(): void {
    this.firebaseService.loadAllCandidates().subscribe({
      next: (candidates) => {
        this.candidates = candidates;
      },
      error: (err) => console.error('Fehler beim Abonnieren der Kandidaten:', err),
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
