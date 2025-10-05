import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-budget-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './budget-modal.component.html',
  styleUrl: './budget-modal.component.css'
})
export class BudgetModalComponent {
  
  constructor(public dialogRef: MatDialogRef<BudgetModalComponent>) {}

  onModifyExisting() {
    this.dialogRef.close(true);
  }

  onCreateNew() {
    this.dialogRef.close(false);
  }
}

