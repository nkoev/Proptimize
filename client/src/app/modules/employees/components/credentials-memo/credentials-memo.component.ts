import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Credentials } from 'src/app/models/credentials';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-credentials-memo',
  templateUrl: './credentials-memo.component.html',
  styleUrls: ['./credentials-memo.component.css'],
})
export class CredentialsMemoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CredentialsMemoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Credentials
  ) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }

  saveToFileSystem() {
    const blob = new Blob(
      [`Username: ${this.data.username} Password: ${this.data.password}`],
      {
        type: 'text/plain;charset=utf-8',
      }
    );
    saveAs(blob, 'credentials.txt');
  }
}
