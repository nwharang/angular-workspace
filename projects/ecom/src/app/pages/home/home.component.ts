import { Component } from '@angular/core';
import { Product } from '@prisma/client';
import { trpc } from '~app/src/trpcClient';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
declare let bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  productList: Product[] = [];
  message = '';
  constructor() {
    this.load();
  }

  async load() {
    await trpc.product.list
      .query({
        page: 1,
        filter: {
          string: null,
          sort: null,
        },
      })
      .then((res) => {
        this.productList = res.items;
      });
  }
  async addToCart(id: string) {
    await trpc.cart.addToCart
      .mutate({ productId: id, quantity: 1 })
      .then(() => {
        this.message = 'Add to cart success';
        this.openToast();
      });
  }
  openToast() {
    const myToast = new bootstrap.Toast(
      document.getElementById('liveToast') as HTMLElement,
      {}
    );
    myToast.show();
  }
}
