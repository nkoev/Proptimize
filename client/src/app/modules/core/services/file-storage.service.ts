import { Injectable } from '@angular/core';
import { CoreModule } from '../core.module';
import { AngularFireStorage } from '@angular/fire/storage';
import { UserService } from '../../employees/services/user.service';

@Injectable({
  providedIn: CoreModule,
})
export class FileStorageService {
  constructor(
    private afStorage: AngularFireStorage,
    private userService: UserService
  ) {}

  async uploadAvatar(file: File, userId: string) {
    const id = Math.random().toString(36).substring(2);
    const ref = this.afStorage.ref(id);
    const result = await ref.put(file);
    ref
      .getDownloadURL()
      .subscribe((res) =>
        this.userService.updateUser(userId, { avatarUrl: res })
      );

    return result;
  }
}
