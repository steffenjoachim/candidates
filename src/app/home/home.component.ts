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

  showVotingSuccessPopup = false; // Popup für erfolgreiche Abstimmung
  showAlreadyVotedPopup = false; // Popup für "Bereits abgestimmt"
  votedCandidateName = ''; // Name des Kandidaten für Popups
  votedCandidateId = ''; // ID des Kandidaten für Stimmenänderung
  currentUser: any;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {
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

  async onVoteUpdated({ id, newVotes }: { id: string; newVotes: number }): Promise<void> {
    if (this.currentUser && this.currentUser.email) {
      const email = this.currentUser.email;

      try {
        // Prüfen, ob der Benutzer bereits abgestimmt hat
        const votedFor = await this.firebaseService.checkIfHasVoted(email);
        if (votedFor) {
          this.votedCandidateName = votedFor; // Setze den Namen des Kandidaten
          this.votedCandidateId = id; // Speichere die ID des neuen Kandidaten
          this.showAlreadyVotedPopup = true; // Zeige das "Bereits abgestimmt"-Popup
          return; // Beende den Vorgang
        }

        // Stimmen aktualisieren, wenn der Benutzer noch nicht abgestimmt hat
        await this.updateVote(id, newVotes, email);
      } catch (error) {
        console.error('Fehler beim Abstimmungsprozess:', error);
      }
    } else {
      alert('Bitte melden Sie sich an, um abzustimmen.');
    }
  }

  async changeVote(): Promise<void> {
    if (this.currentUser && this.currentUser.email) {
      const email = this.currentUser.email;
  
      try {
        // Finde den alten Kandidaten, für den die Stimme bisher abgegeben wurde
        const oldCandidate = this.candidates.find(
          (c) => c.name === this.votedCandidateName
        );
  
        if (oldCandidate) {
          // Stimme des alten Kandidaten reduzieren
          await this.firebaseService.updateVotes(oldCandidate.id, oldCandidate.votes - 1);
          oldCandidate.votes -= 1; // Lokale Liste aktualisieren
        }
  
        // Stimme des neuen Kandidaten hinzufügen
        const newCandidate = this.candidates.find((c) => c.id === this.votedCandidateId);
        if (newCandidate) {
          await this.updateVote(this.votedCandidateId, newCandidate.votes + 1, email);
  
          // Popups steuern
          this.showAlreadyVotedPopup = false; // Schließe das "Bereits abgestimmt"-Popup
          this.showVotingSuccessPopup = true; // Zeige das "Erfolg"-Popup
        }
      } catch (error) {
        console.error('Fehler beim Wechsel der Stimme:', error);
      }
    }
  }  

  async updateVote(candidateId: string, newVotes: number, email: string): Promise<void> {
    try {
      // Stimmen aktualisieren
      await this.firebaseService.updateVotes(candidateId, newVotes);

      // Benutzer als "abgestimmt" markieren
      const candidate = this.candidates.find((c) => c.id === candidateId);
      if (candidate) {
        await this.firebaseService.setUserVoted(email, candidate.name);

        // Lokale Liste der Kandidaten aktualisieren
        candidate.votes = newVotes;

        // Popup vorbereiten
        this.votedCandidateName = candidate.name;
        this.showVotingSuccessPopup = true;
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Stimme:', error);
    }
  }

  // Popups schließen
  closeSuccessPopup(): void {
    this.showVotingSuccessPopup = false;
  }

  closeAlreadyVotedPopup(): void {
    this.showAlreadyVotedPopup = false;
  }
}
