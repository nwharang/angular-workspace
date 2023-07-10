import { Component, OnInit } from '@angular/core';
import { trpc } from '~app/src/trpcClient';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

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
          <input type="text" class="form-control" name="email" ngModel />
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
          <p>Not a member? <a href="#!">Register</a></p>
        </div>
      </form>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  error: string | null = null;
  showLoginPanel = false;

  constructor(private router: Router) {}
  ngOnInit(): void {
    trpc.auth.authenticate
      .mutate()
      .then(() => {
        this.error = 'Logged In\nRederecting to home page in 3 seconds'; // Localize
        setTimeout(() => this.router.navigate(['/']), 3000);
      })
      .catch(() => (this.showLoginPanel = true));
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
        this.router.navigate(['/']);
      });
  }
  resetDefault(form: NgForm) {
    form.resetForm();
    trpc.auth.test.query();
  }
}
