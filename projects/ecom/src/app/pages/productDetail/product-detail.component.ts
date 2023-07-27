import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from '@prisma/client';
import { trpc } from '~app/src/trpcClient';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productId: string = '';
  product: Product[] = [];
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params: Params) => {
      this.productId = params['id'];
    });
  }
  async ngOnInit(): Promise<void> {
    this.product = (await trpc.product.get.query({
      id: this.productId,
    })) as unknown as Product[];
    console.log(this.product);
  }
}
