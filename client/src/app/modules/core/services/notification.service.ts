import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CoreModule } from '../core.module';

@Injectable({
  providedIn: CoreModule,
})
export class NotificationService {
  constructor(private readonly toastrService: ToastrService) {}

  public success(message: string) {
    this.toastrService.success(message);
  }

  public warn(message: string) {
    this.toastrService.warning(message);
  }

  public error(message: string) {
    this.toastrService.error(message);
  }
}
