import { Component } from '@angular/core';
import { trpc } from '~app/src/trpcClient';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="container pt-5" style="max-width: 24rem;">
      <div *ngIf="error" class="text-danger">{{ error }}</div>
      <form #form="ngForm" (ngSubmit)="handleSubmit($event, form)">
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
export class DashboardComponent {
  error: string | null = null;

  async handleSubmit(e: Event, form: NgForm) {
    e.preventDefault();
    const { email, password } = form.value;
    await trpc.auth.login.mutate({ email, password }).catch((err: Error) => {
      this.error = err.message;
    });
  }
  resetDefault(form: NgForm) {
    form.resetForm();
    trpc.auth.test.query();
  }
}
