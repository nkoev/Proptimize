import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subordinates-list',
  templateUrl: './subordinates-list.component.html',
  styleUrls: ['./subordinates-list.component.css'],
})
export class SubordinatesListComponent implements OnInit {
  readonly subordinates: any[];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly data: { subordinates: any[] },
    private dialogRef: MatDialogRef<SubordinatesListComponent>,
    private router: Router
  ) {
    this.subordinates = this.data.subordinates;
  }

  ngOnInit(): void {}

  toDetailEmployee(id: string): void {
    this.dialogRef.close();
    this.router.navigate(['/employees'], {
      queryParams: { id },
    });
  }
}
