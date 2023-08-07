import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from '@prisma/client';
import { trpc } from '~app/src/trpcClient';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
declare let bootstrap: any;
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
  productId: string = '';
  message: string = '';
  product: Product | null = null;
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params: Params) => {
      this.productId = params['id'];
      this.load();
    });
  }
  async load(): Promise<void> {
    trpc.product.get
      .query({
        id: this.productId,
      })
      .then((res) => {
        this.product = res;
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
