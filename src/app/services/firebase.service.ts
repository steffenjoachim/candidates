import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

interface Candidate {
    id: string;
    name: string;
    img: string;
    votes: number;
}

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    private collectionName = "candidates";

    constructor(private firestore: AngularFirestore) {}

    // Alle Kandidaten laden
    loadAllCandidates(): Observable<Candidate[]> {
        return this.firestore
            .collection<Candidate>(this.collectionName)
            .snapshotChanges()
            .pipe(
                map(actions =>
                    actions.map(a => {
                        const data = a.payload.doc.data();
                        const id = a.payload.doc.id;
                        return { id, ...data };
                    })
                )
            );
    }

    // Stimmen aktualisieren
    updateVotes(id: string, newVotes: number): Promise<void> {
        return this.firestore
            .collection(this.collectionName)
            .doc(id)
            .update({ votes: newVotes });
    }
}

// Bitte die letzte Eingabe ignorieren, ich war im falschen Projekt. Ich habe jetzt firebase.service.ts erstellt, wie vorgeschlagen und bekomme einen Fehler: id' is specified more than once, so this usage will be overwritten.ts(2783) bei return { id, ...data };