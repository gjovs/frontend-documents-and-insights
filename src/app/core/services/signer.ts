import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Signer {
  id: string;
  name: string;
  email: string;
  status: string;
  document: string;
}

@Injectable({ providedIn: 'root' })
export class SignerService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/signers';

  createSigner(signerData: { name: string, email: string, document: string }): Observable<Signer> {
    return this.http.post<Signer>(`${this.apiUrl}/`, signerData);
  }

  deleteSigner(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  getSigningUrl(id: string): Observable<{ signing_url: string }> {
    return this.http.post<{ signing_url: string }>(`${this.apiUrl}/${id}/start-signing-process/`, {});
  }
}
