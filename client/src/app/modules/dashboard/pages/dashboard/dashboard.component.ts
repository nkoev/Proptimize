import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserDTO } from 'src/app/models/employees/user.dto';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/modules/employees/services/user.service';
import { EmployeeService } from 'src/app/modules/employees/services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { SubordinatesListComponent } from '../../components/subordinates-list/subordinates-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  loggedUser: UserDTO;
  today = new Date();
  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private userService: UserService,
    private employeeService: EmployeeService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    const sub1 = this.route.data.subscribe((data) => {
      this.loggedUser = data.loggedUser;
    });
    const sub2 = this.auth.loggedUser$.subscribe((res) => {
      this.loggedUser = res;
    });
    this.subscriptions.push(sub1, sub2);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  async showSubordinates(): Promise<void> {
    const subordinates = [
      ...(await this.userService.queryUsers(
        'managedBy.id',
        this.loggedUser.id
      )),
      ...(await this.employeeService.queryEmployees(
        'managedBy.id',
        this.loggedUser.id
      )),
    ];
    this.matDialog.open(SubordinatesListComponent, {
      data: { subordinates },
      minWidth: '300px',
    });
  }
}
