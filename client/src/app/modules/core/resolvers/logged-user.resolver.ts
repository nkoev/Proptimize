import { Injectable } from '@angular/core';
import { CoreModule } from '../core.module';
import { AuthService } from '../services/auth.service';
import { UserDTO } from 'src/app/models/employees/user.dto';

@Injectable({
  providedIn: CoreModule,
})
export class LoggedUserResolver {
  constructor(private auth: AuthService) {}
  resolve(): Promise<UserDTO> {
    return this.auth.getCurrentUser();
  }
}
