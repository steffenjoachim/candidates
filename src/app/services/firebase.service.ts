import {
  Injectable
} from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,

  updateDoc,
  doc,
  query,
  where,
  getDocs,
  addDoc
} from '@angular/fire/firestore';
import {
  Observable,
  from
} from 'rxjs';

import { Candidate } from '../interfaces/candidate.interface';
import { UserVote } from '../interfaces/user-vote.interface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private collectionName = 'candidates';
  private collectionUsers = 'users';

  constructor(private firestore: Firestore) {}

  loadAllCandidates(): Observable < Candidate[] > {
    const candidatesCollection = collection(this.firestore, this.collectionName);
    return from(getDocs(candidatesCollection).then(snapshot => {
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as Candidate));
    }));
  }

  async updateVotes(id: string, newVotes: number): Promise < void > {
    const candidateDocRef = doc(this.firestore, `${this.collectionName}/${id}`);
    await updateDoc(candidateDocRef, { votes: newVotes });
  }

  async checkIfHasVoted(email: string): Promise<string> {
    const usersCollection = collection(this.firestore, this.collectionUsers);
    const userQuery = query(usersCollection, where('email', '==', email));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data() as UserVote;
      return userData.votedFor; // returns the candidate who was voted for (or '' if no vote has been taken yet)
    }

    // adds new user if it does not exist
    await addDoc(usersCollection, { email, votedFor: '' }); // votedFor wird mit leerem String initialisiert
    return ''; // user has not voted jet
  }

  // updates voting status
  async setUserVoted(email: string, votedFor: string): Promise<void> {
    const usersCollection = collection(this.firestore, this.collectionUsers);
    const userQuery = query(usersCollection, where('email', '==', email));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const userDocRef = userSnapshot.docs[0].ref;
      await updateDoc(userDocRef, { votedFor }); // stores candidate in `votedFor`
    }
  }

  async resetUserVote(email: string): Promise<void> {
    const usersCollection = collection(this.firestore, this.collectionUsers);
    const userQuery = query(usersCollection, where('email', '==', email));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const userDocRef = userSnapshot.docs[0].ref;
      await updateDoc(userDocRef, { votedFor: '' }); // resets the vote
  }
 }
}
