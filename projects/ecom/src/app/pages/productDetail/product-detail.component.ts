import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from '@prisma/client';
import { trpc } from '~app/src/trpcClient';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
  productId: string = '';
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
}
