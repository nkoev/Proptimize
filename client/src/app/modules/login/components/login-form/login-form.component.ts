import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { NotificationService } from 'src/app/modules/core/services/notification.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private notificator: NotificationService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(form: FormGroup) {
    form.invalid ? this.notifyErrors() : this.login();
  }

  private notifyErrors() {
    if (this.password.errors?.required) {
      this.notificator.warn(' Please, enter your password.');
    }
    if (this.email.errors?.required || this.email.errors?.email) {
      this.notificator.warn(' Please, provide valid email address.');
    }
  }

  private login() {
    this.auth
      .login(this.email.value, this.password.value)
      .then(() => {
        this.router.navigate(['dashboard']);
      })
      .catch((err) => {
        this.notificator.error('Invalid email or password.');
        console.log(err.message);
      });
  }
}
