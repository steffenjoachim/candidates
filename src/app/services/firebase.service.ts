import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Candidate {
  id: string;
  name: string;
  img: string;
  votes: number;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private collectionName = 'candidates';

  constructor(private firestore: Firestore) {}

  // Kandidaten laden
  loadAllCandidates(): Observable<Candidate[]> {
    const candidatesCollection = collection(this.firestore, this.collectionName);
    return collectionData(candidatesCollection, { idField: 'id' }) as Observable<Candidate[]>;
  }

  // Stimmen aktualisieren
  updateVotes(id: string, newVotes: number): Promise<void> {
    const candidateDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return updateDoc(candidateDoc, { votes: newVotes });
  }
}
