import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserDTO } from 'src/app/models/employees/user.dto';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  loggedUser: UserDTO;
  today = new Date();
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private auth: AuthService) {
    const sub1 = this.route.data.subscribe(
      (data) => (this.loggedUser = data.loggedUser)
    );
    const sub2 = this.auth.loggedUser$.subscribe(
      (res) => (this.loggedUser = res)
    );
    this.subscriptions.push(sub1, sub2);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
