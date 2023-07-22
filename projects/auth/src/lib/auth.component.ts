import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'lib-auth',
  template: `
    <div class="container py-4 h-100">
      <div class="card" style="border-radius: 1rem;">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="row g-0">
            <div class="col-md-6 col-lg-5 d-none d-md-block position-relative">
              <img
                src="assets/images/login.jpg"
                alt="login form"
                class="img-fluid object-fit-cover h-100"
                style="border-radius: 1rem 0 0 1rem;"
              />
              <div
                class="position-absolute top-50 start-50 translate-middle text-center "
              >
                <h2 class="">
                  <span class="fw-bold text-warning" style="font-family: font;"
                    >BANG DANG</span
                  >
                </h2>
                <p class="text-white mb-5" style="letter-spacing: 1px;">
                  Headphone and Earphone
                </p>
              </div>
            </div>

            <div class="col-md-6 col-lg-7 d-flex align-items-center">
              <div class="card-body p-4 p-lg-5 text-black" *ngIf="showLogin">
                <form #frm="ngForm">
                  <h5
                    class="fw-bold mb-3 pb-3 display-5"
                    style="letter-spacing: 1px;"
                  >
                    Sign into your account
                  </h5>

                  <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example17"
                      >Email address</label
                    >
                    <input
                      type="email"
                      name="email"
                      id="form2Example17"
                      class="form-control form-control-lg"
                      [(ngModel)]="data.email"
                    />
                  </div>

                  <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example27"
                      >Password</label
                    >
                    <input
                      type="password"
                      id="form2Example27"
                      class="form-control form-control-lg"
                      name="password"
                      [(ngModel)]="data.password"
                    />
                  </div>

                  <div class="pt-1 mb-4">
                    <button
                      class="btn btn-dark btn-lg btn-block "
                      (click)="show()"
                      type="button"
                    >
                      Login
                    </button>
                  </div>

                  <p class="mb-5 pb-lg-2">
                    Don't have an account?
                    <a type="button" class="fw-bold" (click)="showLogin = false"
                      >Register here</a
                    >
                  </p>
                  <a href="#!" class="small text-muted">Privacy policy</a>
                </form>
              </div>

              <div *ngIf="!showLogin" class="card-body p-4 p-lg-5 text-black">
                <form>
                  <h5
                    class="fw-bold display-5 mb-3 pb-3"
                    style="letter-spacing: 1px;"
                  >
                    Register your account
                  </h5>

                  <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example17"
                      >Email address</label
                    >
                    <input
                      type="email"
                      id="form2Example17"
                      class="form-control form-control-lg"
                    />
                  </div>

                  <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example27"
                      >Password</label
                    >
                    <input
                      type="password"
                      id="form2Example27"
                      class="form-control form-control-lg"
                    />
                  </div>

                  <div class="pt-1 mb-4">
                    <button class="btn btn-dark btn-lg btn-block" type="button">
                      Register
                    </button>
                  </div>

                  <p class="mb-5 pb-lg-2" style="color: #393f81;">
                    Don't have an account?
                    <a
                      class="fw-bold"
                      style="color: #393f81;"
                      (click)="showLogin = true"
                      >Login here</a
                    >
                  </p>
                  <a href="#!" class="small text-muted">Privacy policy</a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  @Output() dataInput = new EventEmitter<{
    email: string;
    password: string;
  }>();
  showLogin: boolean = true;
  data = {
    email: '',
    password: '',
  };

  show() {
    this.dataInput.emit(this.data);
  }
}
