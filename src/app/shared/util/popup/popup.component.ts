import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string, message?: string, options: string[]}) {}
}