import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '~app/src/app/services/auth.service';
import { trpc } from '~app/src/trpcClient';

@Component({
  selector: 'app-auth',
  template: `
    <lib-auth
      *ngIf="!isLogin"
      (dataInput)="login($event)"
      (dataRegister)="register($event)"
    />
    <app-cart *ngIf="isLogin"></app-cart>
  `,
})
export class AuthComponent {
  loading: boolean = false;
  isLogin: boolean = false;
  error: string = '';
  constructor(private router: Router, private authService: AuthService) {
    this.authService.isAuth.then((res) => {
      this.isLogin = res;
    });
    if (this.isLogin) {
      window.location.href = '/home';
    }
  }

  async login(event: { email: string; password: string }) {
    await trpc.auth.login
      .mutate(event)
      .catch((err) => {
        this.error = err.message;
      })
      .then((res) => {
        if (res) {
      window.location.href = '/home';
        }
      });
  }

  async register(event: { email: string; password: string }) {
    await trpc.auth.register
      .mutate(event)
      .catch((err) => {
        this.error = err.message;
      })
      .then((res) => {
        if (res) {
          this.router.navigate(['/home']);
        }
      });
  }
}
