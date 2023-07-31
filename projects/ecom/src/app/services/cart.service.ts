import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '~ecom/src/app/services/auth.service';
import { trpc } from '~ecom/src/trpcClient';

@Injectable({
  providedIn: 'any',
})
export class CartService extends AuthService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cart: any;
  constructor(private router: Router) {
    super();
  }
  async addToCart(id: string) {
    if (!this.isAuth) {
      this.router.navigate(['/auth']);
    }
    await trpc.cart.addToCart
      .mutate({
        productId: id,
        quantity: 1,
      })
      .then((res) => {
        console.log(res);
      });
  }
  async load() {
    return await trpc.cart.list.query();
  }
}
