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
  imports: [CommonModule, HeaderComponent, FooterComponent, CardComponent],
})
export class HomeComponent implements OnInit {
  candidates: Candidate[] = [];
  isLoggedIn = false;
  currentUser: any;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {
    console.log(this.currentUser)
    console.log(this.firebaseService)
    this.authService.user$.subscribe((user) => {
      this.isLoggedIn = !!user; // Prüfen, ob ein User angemeldet ist
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.firebaseService.loadAllCandidates().subscribe({
      next: (candidates) => {
        this.candidates = candidates;
      },
      error: (err) =>
        console.error('Fehler beim Abonnieren der Kandidaten:', err),
    });
  }

  // Methode, die aufgerufen wird, wenn für ein Kandidaten gevotet wurde
  async onVoteUpdated({ id, newVotes }: { id: string; newVotes: number }): Promise<void> {
    if (this.currentUser && this.currentUser.email) { // Sicherstellen, dass die E-Mail existiert
      const email = this.currentUser.email;
  
      try {
        // Überprüfen, ob der Benutzer bereits abgestimmt hat
        const hasVoted = await this.firebaseService.checkIfHasVoted(email);
        if (hasVoted) {
          alert('Sie haben bereits abgestimmt!');
          return; // Keine weitere Aktion ausführen
        }
  
        // Wenn der Benutzer noch nicht abgestimmt hat, aktualisieren wir die Stimmen
        await this.firebaseService.updateVotes(id, newVotes);
  
        // Den Benutzer auf "voted" setzen
        await this.firebaseService.setUserVoted(email);
  
        // Lokale Liste der Kandidaten aktualisieren
        const candidate = this.candidates.find((c) => c.id === id);
        if (candidate) {
          candidate.votes = newVotes;
        }
  
        alert('Danke für Ihre Stimme!');
      } catch (error) {
        console.error('Fehler beim Abstimmungsprozess:', error);
      }
    } else {
      alert('Bitte melden Sie sich an, um abzustimmen.');
    }
  }
  
}
