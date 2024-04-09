import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
  ],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  submit() {
    this.loginService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: (response) => {
          console.log('Resposta da API:', response);
          // Faça o processamento adicional da resposta aqui
          this.toastService.success('Login feito com sucesso');
          this.router.navigate(['/user']);
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error.message;
          console.log('Error:', errorMessage);
          if (error.status === 404) {
            this.toastService.error('Usuário não foi encontrado');
          } else {
            this.toastService.error('Erro inesperado! Tente novamente');
          }
        },
      });
  }

  navigate() {
    this.router.navigate(['/signup']);
  }
}
