import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { LoginPage } from './features/auth/login-page/login-page';
import { CompanyList } from './features/companies/company-list/company-list';
import { DocumentList } from './features/documents/document-list/document-list';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  { path: 'login', component: LoginPage
 },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'companies', pathMatch: 'full' },
      // Nova rota para a lista de empresas
      { path: 'companies', component: CompanyList },
      // Nova rota para os detalhes de uma empresa (que lista os documentos)
      { path: 'companies/:id', component: DocumentList },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
