/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CartItem, Product, ShoppingSession } from '@prisma/client';
import { trpc } from '~app/src/trpcClient';
import { CartService } from '../../services/cart.service';

type Cart = CartItem & {
  Product: Product;
};

@Component({
  selector: 'app-cart',
  template: `
    <div class="container ">
      <h5 class="text-center py-2">Cart</h5>
      <div class="card  p-5">
        <table class="table table-image">
          <thead>
            <tr>
              <th scope="col" colspan="2">Product</th>
              <th scope="col">Price</th>
              <th scope="col" style="width: 10%;">Qty</th>
              <th scope="col">Total</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of cartItem">
              <td class="w-25">
                <img
                  src="{{ item.Product.image }}"
                  class="img-fluid img-thumbnail"
                  alt="Sheep"
                />
              </td>
              <td>{{ item.Product.name }}</td>
              <td>{{ item.Product.price }} $</td>
              <td class="qty ">
                <input
                  type="number"
                  class="form-control  w-fit"
                  #qty
                  (change)="updateQty(item.productId, qty.value)"
                  value="{{ item.qty }}"
                />
              </td>
              <td>{{ item.Product.price * item.qty }} $</td>
              <td>
                <button
                  class="btn btn-danger btn-sm"
                  (click)="deleteItem(item.productId)"
                >
                  <i class="fa fa-times"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="border-top-0 d-flex justify-content-between">
          <h5>Total: <span class="price text-success">89$</span></h5>
          <button type="button" class="btn btn-success">Checkout</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  cart: Promise<void> | ShoppingSession[] = [];
  shoppingSessionId: string = '';
  cartItem: Cart[] = [];
  message: string = '';
  constructor(private cartService: CartService) {
    this.load();
  }

  async load() {
    await this.cartService.load().then((res) => {
      res.map((item) => {
        this.shoppingSessionId = item.id;
        this.cartItem = item.CartItem;
      });
    });
  }
  async updateQty(productId: string, qty: string) {
    await trpc.cart.updateQty.mutate({
      productId: productId,
      quantity: +qty,
      shoppingSessionId: this.shoppingSessionId,
    });
    this.load();
  }
  async deleteItem(productId: string) {
    await trpc.cart.deleteItem
      .mutate({
        productId: productId,
        shoppingSessionId: this.shoppingSessionId,
      })
      .then(() => {
        this.message = 'Item deleted successfully';
      })
      .catch((err) => {
        this.message = err.message;
      });

    this.load();
  }
}
