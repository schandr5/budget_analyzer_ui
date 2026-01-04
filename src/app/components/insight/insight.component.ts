import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InsightsService } from '../../services/insights.service';
import { SharedService } from '../../services/shared.service';
import { BudgetDetails } from '../../constants/interface';

@Component({
  selector: 'app-insight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './insight.component.html',
  styleUrl: './insight.component.css'
})
export class InsightComponent {
  form: FormGroup;
  isLoading = false;
  insightText = '';
  private budgetDetails! : BudgetDetails;
  private budgetId! : number;

  constructor(private fb: FormBuilder, private router: Router,
    private insightsService: InsightsService,
    private sharedService: SharedService) {
    this.form = this.fb.group({
      prompt: ['', Validators.required]
    });

    this.budgetDetails = this.sharedService.getBudgetDetails();
    if (this.budgetDetails) {
        this.budgetId = this.budgetDetails.budgetId;
    }
  }

  onCancel(): void {
    this.router.navigate(['/add-transaction']);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.insightText = '';
    this.insightsService.fetchAiInsights(this.budgetId, this.form.value.prompt).subscribe({
      next: (res) => {
        this.insightText = res;
        console.log('AI insights fetched successfully:', this.insightText);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch AI insights:', err);
      }
    });
  }
}

