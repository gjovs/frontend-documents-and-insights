import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SignerService } from '../../../core/services/signer';

@Component({
  selector: 'app-signer-form',
  templateUrl: './signer-form.html',
  imports: [ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],

})
export class SignerForm {
  private fb = inject(FormBuilder);
  private signerService = inject(SignerService);
  private dialogRef = inject(MatDialogRef<SignerForm>);
  public data: { documentId: string } = inject(MAT_DIALOG_DATA);

  signerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  save() {
    if (this.signerForm.valid) {
      const signerPayload = {
        ...this.signerForm.value,
        document: this.data.documentId
      };
      this.signerService.createSigner(signerPayload as any).subscribe(newSigner => {
        this.dialogRef.close(newSigner);
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
