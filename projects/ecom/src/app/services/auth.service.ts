import { Injectable } from '@angular/core';
import { trpc } from '~ecom/src/trpcClient';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth: Promise<boolean>;
  isAdmin = false;
  constructor() {
    this.isAuth = trpc.auth.authenticate
      .mutate()
      .then(({ authenticate, isAdmin }) => {
        this.isAdmin = isAdmin || false;
        return authenticate;
      });
  }

  authenticate() {
    return this.isAuth;
  }
}
