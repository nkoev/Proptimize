import { Injectable } from '@angular/core';
import { CoreModule } from '../core.module';
import { AngularFireStorage } from '@angular/fire/storage';
import { UserService } from '../../employees/services/user.service';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

@Injectable({
  providedIn: CoreModule,
})
export class FileStorageService {
  constructor(
    private afStorage: AngularFireStorage,
    private userService: UserService
  ) {}

  async uploadAvatar(file: File, userId: string): Promise<UploadTaskSnapshot> {
    const ref = this.afStorage.ref(userId);
    const result = await ref.put(file);
    ref
      .getDownloadURL()
      .subscribe((res) =>
        this.userService.updateUser(userId, { avatarUrl: res })
      );

    return result;
  }
}
