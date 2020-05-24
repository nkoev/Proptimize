import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  constructor(private afs: AngularFirestore) {}

  getSkills() {
    return this.afs
      .collection('skills')
      .snapshotChanges()
      .pipe(
        map((res) => res.map((change: any) => change.payload.doc.data().name))
      );
  }

  async addSkill(skill: { name: string }) {
    return await this.afs.collection('skills').add(skill);
  }
}
