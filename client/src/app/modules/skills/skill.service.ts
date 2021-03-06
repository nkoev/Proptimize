import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  constructor(private afs: AngularFirestore) {}

  getSkills(): Observable<string[]> {
    return this.afs
      .collection('skills')
      .snapshotChanges()
      .pipe(
        map((res) => res.map((change: any) => change.payload.doc.data().name))
      );
  }

  async addSkill(skill: { name: string }): Promise<DocumentReference> {
    return await this.afs.collection('skills').add(skill);
  }
}
