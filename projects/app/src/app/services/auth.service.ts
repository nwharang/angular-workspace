import { Injectable } from '@angular/core';
import { trpc } from '~app/src/trpcClient';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth = false;
  localize = 'en';
  constructor() {
    this.authenticate();
  }

  authenticate() {
    trpc.auth.authenticate.mutate().then(({ localize, authenticate }) => {
      this.localize = localize;
      this.isAuth = authenticate;
    });
  }
}
