import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileStorageService } from 'src/app/modules/core/services/file-storage.service';
import { NotificationService } from 'src/app/modules/core/services/notification.service';
import { UserDTO } from 'src/app/models/employees/user.dto';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { UserService } from 'src/app/modules/employees/services/user.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.css'],
})
export class AvatarUploadComponent implements OnInit {
  @Input() loggedUser: UserDTO;

  constructor(
    private fileStorage: FileStorageService,
    private notificator: NotificationService
  ) {}

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    this.fileStorage
      .uploadAvatar(event.target.files[0], this.loggedUser.id)
      .then(() => {
        this.notificator.success('File uploaded successfully.');
      })
      .catch(() => this.notificator.error('Something went wrong.'));
  }
}
