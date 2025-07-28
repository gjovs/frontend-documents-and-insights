import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Document, DocumentService } from '../../../core/services/document';

// --- Módulos Necessários para o Template ---
import { CommonModule } from '@angular/common'; // Essencial para *ngFor
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-document-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './document-form.html',
  styleUrls: ['./document-form.scss']
})
export class DocumentForm implements OnInit {
  private fb = inject(FormBuilder);
  private documentService = inject(DocumentService);
  private dialogRef = inject(MatDialogRef<DocumentForm>);
  public data?: { companyId: string, document?: Document } = inject(MAT_DIALOG_DATA, { optional: true });

  isEditMode = !!this.data?.document;

  documentForm = this.fb.group({
    name: ['', Validators.required],
    file_url: ['', this.isEditMode ? [] : Validators.required],
    signers_data: this.fb.array([], this.isEditMode ? [] : Validators.required)
  });

  ngOnInit(): void {
    if (this.isEditMode && this.data?.document) {
      this.documentForm.patchValue({ name: this.data.document.name });
    }
  }

  // Helper para acessar o FormArray de signatários facilmente no template
  get signers(): FormArray {
    return this.documentForm.get('signers_data') as FormArray;
  }

  // Adiciona um novo grupo de formulário para um signatário
  addSigner(): void {
    const signerFormGroup = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.signers.push(signerFormGroup);
  }

  // Remove um signatário da lista pelo seu índice
  removeSigner(index: number): void {
    this.signers.removeAt(index);
  }

  save(): void {
    if (!this.documentForm.valid) return;

    const action$ = this.isEditMode && this.data?.document
      ? this.documentService.updateDocument(this.data.document.id, { name: this.documentForm.value.name || '' })
      : this.documentService.createDocument({ ...this.documentForm.value, company: this.data?.companyId });

    action$.subscribe(result => {
      this.dialogRef.close(result);
    });
  }
}
