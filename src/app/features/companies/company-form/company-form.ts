import { Component, inject, type OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CompanyService, type Company } from '../../../core/services/company';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.html',
  imports: [MatDialogTitle, MatDialogContent, MatFormFieldModule, MatDialogActions, ReactiveFormsModule, MatButtonModule, MatInputModule],
})
export class CompanyForm implements OnInit {
  private fb = inject(FormBuilder);
  private companyService = inject(CompanyService);
  private dialogRef = inject(MatDialogRef<CompanyForm>);


  public data?: { company: Company } = inject(MAT_DIALOG_DATA, { optional: true });

  isEditMode = !!this.data; // Flag para saber se é edição ou criação


  ngOnInit(): void {
    if (this.isEditMode && this.data?.company) {
      this.companyForm.patchValue(this.data.company);
    }
  }


  companyForm = this.fb.group({
    name: ['', Validators.required],
    api_token: ['', Validators.required]
  });

  save() {
    if (!this.companyForm.valid) return;

    const saveData$ = this.isEditMode && this.data?.company
      ? this.companyService.updateCompany(this.data.company.id, this.companyForm.value as any)
      : this.companyService.createCompany(this.companyForm.value as any);

    saveData$.subscribe(result => {
      this.dialogRef.close(result);
    });
  }

  close() {
    this.dialogRef.close();
  }
}
