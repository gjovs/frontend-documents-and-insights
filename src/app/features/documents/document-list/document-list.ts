import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { DocumentService, type Document } from '../../../core/services/document';
import { SignerService, type Signer } from '../../../core/services/signer';
import { DisplayLinkDialog } from '../../../shared/components/display-link-dialog/display-link-dialog';
import { DocumentForm } from '../document-form/document-form';
import { SignerForm } from '../signer-form/signer-form';
import { ConfirmationDialog } from '../../../shared/components/confirmation-dialog/confirmation-dialog';


@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.html',
  imports: [CommonModule, MatCardModule, MatListModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  styleUrls: ['./document-list.scss']
})
export class DocumentList implements OnInit {
  private route = inject(ActivatedRoute);
  private documentService = inject(DocumentService);
  private signerService = inject(SignerService);
  private dialog = inject(MatDialog);

  documents = this.documentService.documents;
  streamingDocId = this.documentService.streamingDocId;
  streamedInsightText = this.documentService.streamedInsightText;

  companyId: string | null = null;

  getInsightDisplayState(doc: Document): 'streaming' | 'completed' | 'pending' {
    const streamingId = this.streamingDocId();

    if (streamingId === doc.id) {
      return 'streaming';
    }

    if (doc.insight?.status === 'COMPLETED') {
      return 'completed';
    }

    return 'pending';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.companyId = params.get('id');
      if (this.companyId) {
        this.documentService.getDocumentsByCompany(this.companyId);
      }
    });
  }

  openCreateDocumentDialog(): void {
    const dialogRef = this.dialog.open(DocumentForm, {
      width: '600px',
      data: { companyId: this.companyId }
    });
    dialogRef.afterClosed().subscribe((newDocument: Document | null) => {
      if (newDocument) {  
        this.documentService.startInsightStream(newDocument.id);
      }
    });
  }

  loadDocuments(): void {
    this.route.paramMap.subscribe(params => {
      this.companyId = params.get('id');
      if (this.companyId) {
        this.documentService.getDocumentsByCompany(this.companyId);
      }
    });
  }

  openAddSignerDialog(documentId: string): void {
    const dialogRef = this.dialog.open(SignerForm, {
      width: '400px',
      data: { documentId: documentId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recarrega os documentos para exibir o novo signatário
        this.ngOnInit();
      }
    });
  }

  startSigningProcess(signerId: string): void {
    this.signerService.getSigningUrl(signerId).subscribe(response => {
      this.dialog.open(DisplayLinkDialog, {
        width: '500px',
        data: { link: response.signing_url }
      });
    });
  }

  deleteSigner(signer: Signer, event: MouseEvent): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Você tem certeza que deseja remover o signatário "${signer.name}"?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.signerService.deleteSigner(signer.id).subscribe(() => {
          if (this.companyId) {
            this.documentService.getDocumentsByCompany(this.companyId);
          }
        });
      }
    });
  }

  deleteDocument(document: Document, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Você tem certeza que deseja excluir o documento "${document.name}"?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        // Apenas chama o serviço. A UI irá reagir automaticamente à mudança do signal.
        this.documentService.deleteDocument(document.id).subscribe();
      }
    });
  }


  openEditDocumentDialog(document: Document): void {
    // Impede que o clique no botão propague para o card e dispare a navegação
    const dialogRef = this.dialog.open(DocumentForm, {
      width: '600px',
      // Passa o documento existente para o formulário operar em modo de edição
      data: {
        companyId: this.companyId,
        document: document
      }
    });
  }
}
