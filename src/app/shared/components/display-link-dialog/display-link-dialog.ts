import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-display-link-dialog',
  templateUrl: './display-link-dialog.html',
  imports: [MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ClipboardModule,
    MatSnackBarModule],
})
export class DisplayLinkDialog {
  public data: { link: string } = inject(MAT_DIALOG_DATA);
  private clipboard = inject(Clipboard);
  private snackBar = inject(MatSnackBar);

  copyLink() {
    this.clipboard.copy(this.data.link);
    this.snackBar.open('Link copiado para a área de transferência!', 'Fechar', {
      duration: 2000,
    });
  }
}
