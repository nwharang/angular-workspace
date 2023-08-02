import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Localize } from '@prisma/client';
import { AuthService } from '~app/src/app/services/auth.service';
import { trpc } from '~app/src/trpcClient';

@Component({
  selector: 'app-auth',
  template: `
    <div class="bg-light text-dark">
      <div class="p-4 text-dark">
        <div class="">
          <h5 class="text-center py-2 ">Info Customers</h5>
          <p>
            Name: <span class="fw-light">{{ infoCustomer.name }}</span>
          </p>
          <p>
            Email: <span class="fw-light">{{ infoCustomer.email }}</span>
          </p>
        </div>
      </div>
    </div>

    <lib-auth
      *ngIf="!isLogin"
      (dataInput)="login($event)"
      (dataRegister)="register($event)"
    />
    <app-cart *ngIf="isLogin"></app-cart>
  `,
})
export class AuthComponent {
  infoCustomer: {
    name: string | null;
    email: string;
    photo: string | null;
    localize: Localize | null;
  } = {
    name: '',
    email: '',
    photo: '',
    localize: 'en',
  };
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
    this.getInfor();
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
  async getInfor() {
    await trpc.user.info.query().then((res) => {
      this.infoCustomer = res;
    });
  }
}
