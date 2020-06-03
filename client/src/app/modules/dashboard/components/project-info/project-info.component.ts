import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GanttService } from 'src/app/modules/projects/services/gantt.service';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css'],
})
export class ProjectInfoComponent implements OnInit {
  @ViewChild('charts') public chartEl: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      name: string;
      startDate: Date;
      endDate: Date;
      skills: {
        skill: string;
        startDate: Date;
        endDate: Date;
        completeness: { amount: number; fill: boolean };
      }[];
    },
    private gantt: GanttService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.gantt.drawGantt(
        this.chartEl.nativeElement,
        this.data.name,
        this.data.startDate,
        this.data.endDate,
        this.data.skills
      );
    });
  }
}
