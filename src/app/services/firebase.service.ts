import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, updateDoc, doc, query, getDocs } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

export interface Candidate {
  id: string;
  name: string;
  img: string;
  votes: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private collectionName = 'candidates';

  constructor(private firestore: Firestore) {}

  // Alle Kandidaten laden
  loadAllCandidates(): Observable<Candidate[]> {
    const candidatesCollection = collection(this.firestore, this.collectionName);
    // Abrufen der Dokumente als Observable
    return from(getDocs(candidatesCollection).then(snapshot => {
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as Candidate));
    }));
  }

  // Stimmen aktualisieren
  async updateVotes(id: string, newVotes: number): Promise<void> {
    const candidateDocRef = doc(this.firestore, `${this.collectionName}/${id}`);
    await updateDoc(candidateDocRef, { votes: newVotes });
  }
}
