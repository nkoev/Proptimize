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

  getByStatus(status: string) {
    this.projectsColl = this.afs.collection<ProjectDTO>('projects', ref => ref.orderBy('status', 'desc'));
    return this.getProjectsData();
  }

  getMovies(start, end, orderBy: string) {
    this.projectsColl = this.afs.collection<ProjectDTO>('projects', ref => {
      console.log(start);
      return ref.limit(4).orderBy(orderBy).startAt(start).endBefore(end);
    });

    return this.projectsColl.valueChanges();
  }

  getMoviesNew(limit: number, orderBy: string, last?: string, end?: string, status?: string, skill?: string) {
    this.projectsColl = this.afs.collection<ProjectDTO>('projects', ref => {
      if (last && end) {
        if (status && skill) {
          return ref.orderBy(orderBy).limit(limit)
            .where('status', '==', status)
            .where('skills', 'array-contains', skill)
            .startAt(last).endBefore(end);
        } else if (status) {
          return ref.orderBy(orderBy).limit(limit)
            .where('status', '==', status)
            .startAt(last).endBefore(end);
        } else if (skill) {
          return ref.orderBy(orderBy).limit(limit)
            .where('skills', 'array-contains', skill)
            .startAt(last).endBefore(end);
        } else {
          return ref.orderBy(orderBy).limit(limit).startAt(last).endBefore(end);
        }

      } else if (last) {
        if (status && skill) {
          return ref.orderBy(orderBy).limit(limit)
            .where('status', '==', status)
            .where('skills', 'array-contains', skill)
            .startAt(last);
        } else if (status) {
          return ref.orderBy(orderBy).limit(limit)
            .where('status', '==', status)
            .startAt(last);
        } else if (skill) {
          return ref.orderBy(orderBy).limit(limit)
            .where('skills', 'array-contains', skill)
            .startAt(last);
        } else {
          console.log('tuka');
          return ref.orderBy(orderBy).limit(limit).startAt(last);
        }

      } else {
        if (status && skill) {
          return ref.orderBy(orderBy).limit(limit)
            .where('status', '==', status)
            .where('skills', 'array-contains', skill);
        } else if (status) {
          return ref.orderBy(orderBy).limit(limit)
            .where('status', '==', status);
        } else if (skill) {
          return ref.orderBy(orderBy).limit(limit)
            .where('skills', 'array-contains', skill);
        } else {
          return ref.orderBy(orderBy).limit(limit);
        }
      }

    });

    return this.projectsColl.snapshotChanges().pipe(
      map(changes => changes.map(a => {
        const data = a.payload.doc.data() as ProjectDTO;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
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
    }

    return this.projectsColl.add(newProject);
  }

}
