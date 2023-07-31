import { Injectable } from '@angular/core';
import { trpc } from '~ecom/src/trpcClient';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth: boolean = false;
  constructor() {
    trpc.auth.authenticate.mutate().then(({ authenticate }) => {
      this.isAuth = authenticate;
    });
  }

  authenticate() {
    return this.isAuth;
  }
  logout() {
    trpc.auth.logout.mutate().then(() => {
      this.isAuth = false;
    });
  }
}
