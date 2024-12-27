import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, updateDoc, doc, query } from '@angular/fire/firestore';
import { Observable, tap } from 'rxjs';

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

  constructor(private firestore: Firestore) {console.log('Firestore erfolgreich initialisiert:', this.firestore);}

  // Alle Kandidaten laden
  loadAllCandidates(): Observable<Candidate[]> {
    const candidatesCollection = collection(this.firestore, this.collectionName);
    console.log('Collection erstellt:', candidatesCollection);
  
    return collectionData(candidatesCollection, { idField: 'id' }).pipe(
      tap({
        next: (data: any) => console.log('Kandidaten-Daten erhalten:', data),
        error: (err) => console.error('Fehler beim Abrufen der Kandidaten:', err),
      })
    ) as Observable<Candidate[]>;
  }  

  // Stimmen aktualisieren
  async updateVotes(id: string, newVotes: number): Promise<void> {
    const candidateDocRef = doc(this.firestore, `${this.collectionName}/${id}`);
    await updateDoc(candidateDocRef, { votes: newVotes });
  }
}
