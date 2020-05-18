import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orgchart',
  templateUrl: './orgchart.component.html',
  styleUrls: ['./orgchart.component.css'],
})
export class OrgchartComponent implements OnInit {
  title = 'Hello';
  type = 'OrgChart';

  constructor() {}

  ngOnInit(): void {}
}
