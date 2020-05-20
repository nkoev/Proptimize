import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-single-project',
  templateUrl: './single-project.component.html',
  styleUrls: ['./single-project.component.css']
})
export class SingleProjectComponent implements OnInit {

  @Output() toggleEvent = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  togglePanes() {
    this.toggleEvent.emit(true);
  }
}
