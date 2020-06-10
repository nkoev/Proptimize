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
  skill: FormControl;
  subscriptions: Subscription[] = [];

  constructor(
    private skillService: SkillService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private notificator: NotificationService
  ) {}

  ngOnInit(): void {
    this.skill = new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
      Validators.pattern('^[A-Za-z].*'),
    ]);
    const sub1 = this.skillService
      .getSkills()
      .subscribe((res: any) => (this.skills = res));
    const sub2 = this.route.data.subscribe(
      (data) => (this.loggedUser = data.loggedUser)
    );
    const sub3 = this.auth.loggedUser$.subscribe((res) =>
      res ? (this.loggedUser = res) : this.router.navigate(['login'])
    );
    const sub4 = this.skill.valueChanges.subscribe(() => {
      this.skill.patchValue(
        this.skill.value.charAt(0).toUpperCase() + this.skill.value.slice(1),
        { emitEvent: false }
      );
    });
    this.subscriptions.push(sub1, sub2, sub3, sub4);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  addSkill(): void {
    let skill = this.skill.value?.trim();
    skill = skill.charAt(0).toUpperCase() + skill.slice(1);
    const skills = this.skills.map((s) => s.toLowerCase());
    skills.includes(skill.toLowerCase())
      ? this.notificator.warn('This skill is already on the list')
      : this.skill.errors?.pattern
      ? this.notificator.warn('Skill name should start with a letter')
      : this.skill.errors?.maxlength
      ? this.notificator.warn('Skill name should not exceed 20 characters')
      : this.skill.errors?.required
      ? this.notificator.warn('Please type in some skill')
      : (this.skillService.addSkill({ name: skill }),
        this.skills.push(skill),
        this.skill.reset());
  }
}
