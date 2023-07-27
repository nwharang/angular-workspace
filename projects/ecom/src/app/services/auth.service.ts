import { Injectable } from '@angular/core';
import { trpc } from '~ecom/src/trpcClient';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth: Promise<boolean>;
  localize = 'en';
  constructor() {
    this.isAuth = trpc.auth.authenticate.mutate().then(({ authenticate }) => {
      return authenticate;
    });
  }

  authenticate() {}
}
