import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { ProjectDTO } from 'src/app/models/projects/project.dto';
import { ProjectCreateDTO } from 'src/app/models/projects/project-create.dto';
import { ProjectStatusType } from 'src/app/models/projects/project-status.type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsColl: AngularFirestoreCollection<ProjectDTO>;
  private projects$: Observable<ProjectDTO[]>;

  constructor(private readonly afs: AngularFirestore) {
  }

  private getProjectsData(): Observable<ProjectDTO[]> {
    return this.projectsColl.snapshotChanges().pipe(
      map(changes => changes.map(a => {
        const data = a.payload.doc.data() as ProjectDTO;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getAll() {
    this.projectsColl = this.afs.collection<ProjectDTO>('projects', ref => ref.orderBy('createdAt', 'desc'));
    return this.getProjectsData();
  }

  addProject(project: ProjectCreateDTO): Promise<any> {
    const newProject: ProjectDTO = {
      reporter: {
        id: 'CU8zQQjjnIY3Q76ovnFP',
        firstName: 'Stamat',
        lastName: 'Batalev'
      },
      name: project.name,
      description: project.description,
      targetInDays: project.targetInDays,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: ProjectStatusType.InProgress,
      skills: ['tarator'],
    }

    return this.projectsColl.add(newProject);
  }

}
