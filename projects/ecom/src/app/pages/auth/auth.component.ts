import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Localize, Order } from '@prisma/client';
import { AuthService } from '~app/src/app/services/auth.service';
import { trpc } from '~app/src/trpcClient';

@Component({
  selector: 'app-auth',
  template: `
    <section class="bg-light">
      <div class="container my-3">
        <div class="bg-light text-dark row" *ngIf="isLogin">
          <div class=" text-dark col">
            <h5 class="text-center py-2 ">Info Customers</h5>
            <div class="card p-3">
              <p>
                Name: <span class="fw-light">{{ infoCustomer.name }}</span>
              </p>
              <p>
                Email: <span class="fw-light">{{ infoCustomer.email }}</span>
              </p>
            </div>
          </div>
          <div class="col  ">
            <h5 class="text-center py-2  ">Order</h5>
            <p *ngIf="!order">No order</p>
            <div class="table-responsive text-dark" *ngIf="order">
              <table class="table border rounded">
                <thead>
                  <tr>
                    <!-- id: string; status: OrderStatus; createdAt: Date;
                      updatedAt: Date; address: string | null; -->
                    <th scope="col">Stt</th>
                    <th scope="col">status</th>
                    <th scope="col">createdAt</th>
                    <th scope="col">updatedAt</th>
                    <th scope="col">address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="" *ngFor="let item of order; let i = index">
                    <th scope="row">{{ i + 1 }}</th>
                    <td>{{ item.status }}</td>
                    <td>{{ item.createdAt | date }}</td>
                    <td>{{ item.updatedAt | date }}</td>
                    <td>{{ item.address }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
    <lib-auth
      *ngIf="!isLogin"
      (dataInput)="login($event)"
      (dataRegister)="register($event)"
    />
  `,
})
export class AuthComponent {
  order: Order[] = [];
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
    this.getOrderByUser();
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
  async getOrderByUser() {
    await trpc.cart.getOrderByUser.query().then((res) => {
      this.order = res as Order[];
    });
  }
}
