import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Company, CompanyService } from '../../../core/services/company';
import { CompanyForm } from '../company-form/company-form';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialog } from '../../../shared/components/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.html',
  imports: [MatIconModule, MatTableModule, AsyncPipe, DatePipe, MatButtonModule],
  styleUrls: ['./company-list.scss']
})
export class CompanyList implements OnInit {
  private companyService = inject(CompanyService);
  private dialog = inject(MatDialog);
  private router = inject(Router);


  displayedColumns: string[] = ['name', 'created_at', 'actions'];


  companies = this.companyService.companies;


  ngOnInit(): void {
    this.companyService.loadCompanies();
  }

 openCreateDialog(): void {
    this.dialog.open(CompanyForm, { width: '400px' });
  }

  openEditDialog(company: Company): void {
    this.dialog.open(CompanyForm, {
      width: '400px',
      data: { company: company }
    });
  }

  deleteCompany(company: Company): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Você tem certeza que deseja excluir a empresa "${company.name}"?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.companyService.deleteCompany(company.id).subscribe();
      }
    });
  }

  viewCompany(company: Company): void {
    this.router.navigate(['/companies', company.id]);
  }
}
