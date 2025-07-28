import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  MatIcon
} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss'],
  imports: [MatIcon,   ReactiveFormsModule, MatFormField, MatLabel, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
  console.log('Form submitted:', this.loginForm.value);
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value as any).subscribe({
        error: (err) => console.error('Falha no login', err)
      });
    }
  }
}
