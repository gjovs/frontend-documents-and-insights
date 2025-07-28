
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, type Subscription } from 'rxjs';
import { Signer } from './signer';
import { SseService } from './sse';
import { AuthService } from './auth';

// Interface para tipar os dados do Documento, refletindo o backend
export interface Document {
  id: string;
  name: string;
  zapsign_open_id: string;
  zapsign_token: string;
  status: string;
  created_at: string;
  signers: Signer[]; // A API aninha os signatários dentro do documento
  insight: Insight | null; // O insight pode ser nulo inicialmente

}
export interface Insight {
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  content: { summary: string } | null;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private http = inject(HttpClient);
  private sseService = inject(SseService);
  private authService = inject(AuthService);
  private apiUrl = '/api/v1/documents';


  private readonly _documents = signal<Document[]>([]);
  private readonly _streamingDocId = signal<string | null>(null);
  private readonly _streamedInsightText = signal<string>('');


  public readonly documents = this._documents.asReadonly();
  public readonly streamingDocId = this._streamingDocId.asReadonly();
  public readonly streamedInsightText = this._streamedInsightText.asReadonly();

  // --- Propriedades de Estado Reativo para o Streaming ---
  private streamSubscription: Subscription | null = null;

  updateDocument(id: string, docData: { name: string }): Observable<Document> {
    return this.http.patch<Document>(`${this.apiUrl}/${id}/`, docData).pipe(
      tap(updatedDoc => {
        this._documents.update(docs =>
          docs.map(doc => doc.id === id ? updatedDoc : doc)
        );
      })
    );
  }

  // Modifique este método para atualizar o signal
  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`).pipe(
      tap(() => {
        this._documents.update(docs => docs.filter(doc => doc.id !== id));
      })
    );
  }


  getDocumentsByCompany(companyId: string): void {
    this.http.get<Document[]>(`${this.apiUrl}/`, { params: { company_id: companyId } })
      .subscribe(docs => this._documents.set(docs));
  }

  createDocument(docData: any): Observable<Document> {
    return this.http.post<Document>(`${this.apiUrl}/`, docData).pipe(
      tap(newDoc => {
        this._documents.update(currentDocs => [...currentDocs, newDoc]);
      })
    );
  }

  startInsightStream(documentId: string): void {
    this.stopInsightStream();
    const token = this.authService.getToken();
    if (!token) { return; }

    const streamUrl = `/api/v1/documents/${documentId}/insights/stream/?token=${token}`;
    this._streamingDocId.set(documentId);
    this._streamedInsightText.set('');

    this.streamSubscription = this.sseService.getServerSentEvents(streamUrl).subscribe({
      next: event => {
        if (event.data.event === 'STREAM_END') {
          this.finalizeStream();
          return;
        }

        if (event.data.token) {
          this._streamedInsightText.update(currentText => currentText + event.data.token);
        }

      },
      error: () => this.stopInsightStream()
    });
  }

  private finalizeStream(): void {
    const docId = this._streamingDocId();
    const finalText = this._streamedInsightText();

    this.stopInsightStream();


    this._documents.update(currentDocs => {
      const docIndex = currentDocs.findIndex(doc => doc.id === docId);
      if (docIndex === -1) return currentDocs;

      const docToUpdate = { ...currentDocs[docIndex] };
      if (docToUpdate.insight) {
        docToUpdate.insight.content = { summary: finalText };
        docToUpdate.insight.status = 'COMPLETED';
      }
      const updatedDocs = [...currentDocs];
      updatedDocs[docIndex] = docToUpdate;
      return updatedDocs;
    });
  }

  stopInsightStream(): void {
    this.streamSubscription?.unsubscribe();
    this.streamSubscription = null;
    this._streamingDocId.set(null);
  }

  ngOnDestroy(): void {
    this.stopInsightStream();
  }
}
