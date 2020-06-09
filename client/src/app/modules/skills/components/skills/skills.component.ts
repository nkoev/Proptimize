import { Component, OnInit, OnDestroy } from '@angular/core';
import { SkillService } from '../../skill.service';
import { FormControl, Validators } from '@angular/forms';
import { UserDTO } from 'src/app/models/employees/user.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/modules/core/services/notification.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
})
export class SkillsComponent implements OnInit, OnDestroy {
  today = new Date();
  loggedUser: UserDTO;
  skills: string[];
  skill = new FormControl('', [Validators.required, Validators.maxLength(20)]);
  subscriptions: Subscription[] = [];

  constructor(
    private skillService: SkillService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private notificator: NotificationService
  ) {}

  ngOnInit(): void {
    const sub1 = this.skillService
      .getSkills()
      .subscribe((res: any) => (this.skills = res));
    const sub2 = this.route.data.subscribe(
      (data) => (this.loggedUser = data.loggedUser)
    );
    const sub3 = this.auth.loggedUser$.subscribe((res) =>
      res ? (this.loggedUser = res) : this.router.navigate(['login'])
    );
    this.subscriptions.push(sub1, sub2, sub3);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  addSkill(): void {
    this.skills.includes(this.skill.value)
      ? this.notificator.warn('This skill is already on the list')
      : this.skill.errors.maxlength
      ? this.notificator.warn('Skill name should not exceed 20 characters')
      : this.skill.errors.required
      ? this.notificator.warn('Please type in some skill')
      : (this.skillService.addSkill({ name: this.skill.value }),
        this.skills.push(this.skill.value),
        this.skill.reset());
  }
}
