import { NgModule } from '@angular/core';
import { SkillsComponent } from './components/skills/skills.component';
import { SkillsRoutingModule } from './skills-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [SkillsComponent],
  imports: [
    SkillsRoutingModule,
    SharedModule
  ]
})
export class SkillsModule { }
