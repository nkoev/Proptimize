import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [SharedModule, LoginRoutingModule],
})
export class LoginModule {}
