import { Component, OnInit } from '@angular/core';
import { trpc } from '~ecom/src/trpcClient';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  template: `
    <div class="container pt-5" style="max-width: 24rem;">
      <div *ngIf="error" class="text-danger">{{ error }}</div>
      <form
        *ngIf="showLoginPanel"
        #form="ngForm"
        (ngSubmit)="handleSubmit($event, form)"
      >
        <!-- Email input -->
        <div class="form-outline mb-4">
          <input type="email" class="form-control" autocomplete="on" name="email" ngModel />
          <label class="form-label" for="form2Example1">Email address</label>
        </div>

        <!-- Password input -->
        <div class="form-outline mb-4">
          <input type="password" class="form-control" name="password" ngModel />
          <label class="form-label" for="form2Example2">Password</label>
        </div>

        <!-- Submit button -->
        <div class="d-flex gap-3">
          <button type="submit" class="btn btn-primary btn-block mb-4">
            Sign in
          </button>
          <button
            type="button"
            class="btn btn-primary btn-block mb-4"
            (click)="resetDefault(form)"
          >
            Reset
          </button>
        </div>

        <!-- Register buttons -->
        <div class="text-center">
          <p>Not a member? <a href="#">Register</a></p>
        </div>
      </form>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  error: string | null = null;
  showLoginPanel = false;

  constructor(private router: Router, private authService: AuthService) {}
  async ngOnInit(): Promise<void> {
    if (await this.authService.isAuth) {
      this.error = 'Logged In\nRederecting to home page in 3 seconds'; // Localize
    } else this.showLoginPanel = true;
  }
  async handleSubmit(e: Event, form: NgForm) {
    e.preventDefault();
    const { email, password } = form.value;
    await trpc.auth.login
      .mutate({ email, password })
      .catch((err: Error) => {
        this.error = err.message;
      })
      .then(() => {
        location.pathname = '/';
      });
  }
  resetDefault(form: NgForm) {
    form.resetForm();
  }
}
