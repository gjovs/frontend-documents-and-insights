import { Component, inject } from '@angular/core';
import {
  MatToolbarModule
} from '@angular/material/toolbar';
import { AuthService } from '../../core/services/auth';

import {
  MatSidenavModule
} from '@angular/material/sidenav';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
  RouterModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
