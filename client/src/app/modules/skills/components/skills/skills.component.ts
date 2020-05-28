import { Component, OnInit } from '@angular/core';
import { SkillService } from '../../skill.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
})
export class SkillsComponent implements OnInit {
  today = new Date();
  skills: string[];
  skill: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(20),
  ]);

  constructor(private skillService: SkillService) { }

  ngOnInit(): void {
    this.skillService.getSkills().subscribe((res: any) => (this.skills = res));
  }

  addSkill() {
    if (this.skill.valid) {
      this.skillService.addSkill({ name: this.skill.value });
      this.skill.reset();
    }
  }
}
