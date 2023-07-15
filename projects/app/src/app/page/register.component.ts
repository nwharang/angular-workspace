import { Component, OnInit } from '@angular/core';
import { trpc } from '~app/src/trpcClient';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="container pt-5" style="max-width: 24rem;">
      <div *ngIf="error" class="text-danger">{{ error }}</div>
      <form
        *ngIf="showLoginPanel"
        #form="ngForm"
        (ngSubmit)="handleSubmit($event, form)"
      >
        <!-- Name input -->
        <div class="form-outline mb-4">
          <input type="text" class="form-control" name="name" ngModel />
          <label class="form-label">Name</label>
        </div>

        <!-- Email input -->
        <div class="form-outline mb-4">
          <input type="text" class="form-control" name="email" ngModel />
          <label class="form-label">Email address</label>
        </div>

        <!-- Password input -->
        <div class="form-outline mb-4">
          <input type="password" class="form-control" name="password" ngModel />
          <label class="form-label">Password</label>
        </div>

        <!-- Submit button -->
        <div class="d-flex gap-3">
          <button type="submit" class="btn btn-primary btn-block mb-4">
            Register
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
          <p>Have account <a href="#">Login</a></p>
        </div>
      </form>
    </div>
  `,
})
export class RegisterComponent implements OnInit {
  error: string | null = null;
  showLoginPanel = false;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    if (this.authService.isAuth) {
      this.error = 'Logged In\nRederecting to home page in 3 seconds'; // Localize
    } else this.showLoginPanel = true;
  }
  async handleSubmit(e: Event, form: NgForm) {
    e.preventDefault();
    const { email, password, name } = form.value;
    await trpc.auth.register
      .mutate({ email, password, name })
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
