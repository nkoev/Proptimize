import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CoreModule } from '../core.module';

@Injectable({
  providedIn: CoreModule,
})
export class NotificationService {
  constructor(private readonly toastrService: ToastrService) {}

  public success(message: string): void {
    this.toastrService.success(message);
  }

  public warn(message: string): void {
    this.toastrService.warning(message);
  }

  public error(message: string): void {
    this.toastrService.error(message);
  }
}
