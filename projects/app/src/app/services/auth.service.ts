import { Injectable } from '@angular/core';
import { trpc } from '~app/src/trpcClient';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth: Promise<boolean>;
  localize = 'en';
  constructor() {
    this.isAuth = trpc.auth.authenticate
      .mutate()
      .then(({ localize, authenticate }) => {
        this.localize = localize;
        return authenticate;
      });
  }

  authenticate() {}
}
