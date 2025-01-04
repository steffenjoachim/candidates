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

export interface Candidate {
  id: string;
  name: string;
  img: string;
  votes: number;
}

export interface UserVote {
  email: string;
  votedFor: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private collectionName = 'candidates';
  private collectionUsers = 'users';

  constructor(private firestore: Firestore) {}

  // Alle Kandidaten laden
  loadAllCandidates(): Observable < Candidate[] > {
    const candidatesCollection = collection(this.firestore, this.collectionName);
    return from(getDocs(candidatesCollection).then(snapshot => {
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as Candidate));
    }));
  }

  // Stimmen aktualisieren
  async updateVotes(id: string, newVotes: number): Promise < void > {
    const candidateDocRef = doc(this.firestore, `${this.collectionName}/${id}`);
    await updateDoc(candidateDocRef, { votes: newVotes });
  }

  // Überprüfen, ob der Benutzer bereits abgestimmt hat
  async checkIfHasVoted(email: string): Promise<string> {
    const usersCollection = collection(this.firestore, this.collectionUsers);
    const userQuery = query(usersCollection, where('email', '==', email));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data() as UserVote;
      return userData.votedFor; // Gibt den Kandidaten zurück, für den abgestimmt wurde (oder '' falls noch nicht abgestimmt)
    }

    // Neuer Benutzer hinzufügen, wenn er nicht existiert
    await addDoc(usersCollection, { email, votedFor: '' }); // votedFor wird mit leerem String initialisiert
    return ''; // Benutzer hat noch nicht abgestimmt
  }

  // Abstimmungsstatus aktualisieren
  async setUserVoted(email: string, votedFor: string): Promise<void> {
    const usersCollection = collection(this.firestore, this.collectionUsers);
    const userQuery = query(usersCollection, where('email', '==', email));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const userDocRef = userSnapshot.docs[0].ref;
      await updateDoc(userDocRef, { votedFor }); // Kandidat wird im Feld `votedFor` gespeichert
    }
  }

  async resetUserVote(email: string): Promise<void> {
    const usersCollection = collection(this.firestore, this.collectionUsers);
    const userQuery = query(usersCollection, where('email', '==', email));
    const userSnapshot = await getDocs(userQuery);
  
    if (!userSnapshot.empty) {
      const userDocRef = userSnapshot.docs[0].ref;
      await updateDoc(userDocRef, { votedFor: '' }); // Zurücksetzen der Stimme
    }
  }
  
}
