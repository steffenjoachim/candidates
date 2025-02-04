import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { ChancellorCandidateCardComponent } from './components/chancellor-candidate-card/chancellor-candidate.card.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { Candidate } from '../interfaces/candidate.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ChancellorCandidateCardComponent,
  ],
})
export class HomeComponent implements OnInit {
  candidates: Candidate[] = [];
  isLoggedIn = false;

  showVotingSuccessPopup = signal(false);
  showAlreadyVotedPopup = signal(false);
  showDoubleVotedPopup = signal(false);
  votedCandidateName = ''; // candidate name for popups
  votedCandidateId = ''; // id of candidate for changing vote
  currentUser: any;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
  ) {
    this.authService.user$.subscribe((user) => {
      this.isLoggedIn = !!user; // checks if a user is logged in and converts value to a boolean value
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

  async onVoteUpdated(
    { id, newVotes }: { id: string; newVotes: number },
    candidate: Candidate,
  ): Promise<void> {
    console.log(candidate);
    if (this.currentUser && this.currentUser.email) {
      const email = this.currentUser.email;
      try {
        // checks if a user has already voted
        const votedFor = await this.firebaseService.checkIfHasVoted(email);
        if (votedFor) {
          if (votedFor === candidate.name) {
            console.log('User hat bereits für diesen Kandidaten gestimmt');
            this.showDoubleVotedPopup.set(true);
            return;
          }

          this.votedCandidateName = votedFor; // sets the candidate's name
          this.votedCandidateId = id; // saves the ID of the new candidate
          this.showAlreadyVotedPopup.set(true); // shows the popup
          return;
        }

        // updates votes if the user has not voted yet
        await this.updateVote(id, newVotes, email);
      } catch (error) {
        console.error('Fehler beim Abstimmungsprozess:', error);
      }
    }
  }

  async changeVote(): Promise<void> {
    if (this.currentUser && this.currentUser.email) {
      const email = this.currentUser.email;

      try {
        // finds the old candidate for whom the vote has been cast so far
        const oldCandidate = this.candidates.find(
          (c) => c.name === this.votedCandidateName,
        );

        if (oldCandidate) {
          // reduces the old candidate's vote
          await this.firebaseService.updateVotes(
            oldCandidate.id,
            oldCandidate.votes - 1,
          );
          oldCandidate.votes -= 1;
        }

        // adds new candidate's vote
        const newCandidate = this.candidates.find(
          (c) => c.id === this.votedCandidateId,
        );
        if (newCandidate) {
          await this.updateVote(
            this.votedCandidateId,
            newCandidate.votes + 1,
            email,
          );

          // popup controle
          this.showAlreadyVotedPopup.set(false);
          this.showDoubleVotedPopup.set(false);
          this.showVotingSuccessPopup.set(true);
        }
      } catch (error) {
        console.error('Fehler beim Wechsel der Stimme:', error);
      }
    }
  }

  async updateVote(
    candidateId: string,
    newVotes: number,
    email: string,
  ): Promise<void> {
    try {
      // updates votes
      await this.firebaseService.updateVotes(candidateId, newVotes);

      // markes user as "has voted"
      const candidate = this.candidates.find((c) => c.id === candidateId);
      if (candidate) {
        await this.firebaseService.setUserVoted(email, candidate.name);

        //updates candidates list
        candidate.votes = newVotes;

        // prepare success-popup
        this.votedCandidateName = candidate.name;
        this.showVotingSuccessPopup.set(true);
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Stimme:', error);
    }
  }

  closePopup(popupType: 'success' | 'alreadyVoted' | 'doubleVoted'): void {
    if (popupType === 'success') {
      this.showVotingSuccessPopup.set(false);
    } else if (popupType === 'alreadyVoted') {
      this.showAlreadyVotedPopup.set(false);
    } else if (popupType === 'doubleVoted') {
      this.showDoubleVotedPopup.set(false);
    }
  }
}
