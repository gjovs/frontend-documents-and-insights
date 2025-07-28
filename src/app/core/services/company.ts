import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

// Definimos uma interface para tipar os dados da Empresa
export interface Company {
  id: string;
  name: string;
  api_token?: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/companies';

  // --- Gerenciamento de Estado com Signal ---
  private readonly _companies = signal<Company[]>([]);
  public readonly companies = this._companies.asReadonly();

  loadCompanies(): void {
    this.http.get<Company[]>(`${this.apiUrl}/`).subscribe(data => {
      this._companies.set(data);
    });
  }

  createCompany(companyData: { name: string, api_token: string }): Observable<Company> {
    return this.http.post<Company>(`${this.apiUrl}/`, companyData).pipe(
      tap(newCompany => {
        this._companies.update(companies => [...companies, newCompany]);
      })
    );
  }

  updateCompany(id: string, companyData: { name: string, api_token: string }): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${id}/`, companyData).pipe(
      tap(updatedCompany => {
        this._companies.update(companies =>
          companies.map(c => c.id === id ? updatedCompany : c)
        );
      })
    );
  }

  deleteCompany(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`).pipe(
      tap(() => {
        this._companies.update(companies => companies.filter(c => c.id !== id));
      })
    );
  }
}
