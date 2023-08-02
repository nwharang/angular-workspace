/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { Prisma, ShoppingSession } from '@prisma/client';
import { trpc } from '~app/src/trpcClient';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
declare let bootstrap: any;
const CartItemWithProduct = Prisma.validator<Prisma.CartItemArgs>()({
  include: { Product: true },
});
type Cart = Prisma.CartItemGetPayload<typeof CartItemWithProduct>;

@Component({
  selector: 'app-cart',
  template: `
    <section class="bg-light" *ngIf="!Checkout">
      <div class="container ">
        <div class="card  p-5">
          <h5 class="text-center py-2  text-dark">Cart</h5>
          <table class="table table-image">
            <thead>
              <tr>
                <th scope="col" colspan="2">Product</th>
                <th scope="col">Price</th>
                <th scope="col">Qty</th>
                <th scope="col">Total</th>
                <th scope="col">
                  <button class="btn btn-danger btn-sm" (click)="clearCart()">
                    <i class="fa fa-times"></i>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of cartItem">
                <td style="width: 20%;">
                  <img
                    src="{{ item.Product.image }}"
                    class="img-fluid img-thumbnail"
                    alt="Sheep"
                  />
                </td>
                <td>
                  {{ item.Product.name }}
                  <br />
                  <span class="fw-light">
                    {{ item.Product.description }}
                  </span>
                </td>
                <td>{{ item.Product.price }}$</td>
                <td class="qty ">
                  <input
                    type="number"
                    class="form-control"
                    #qty
                    style="min-width: min-content"
                    (change)="updateQty(item.productId, qty.value)"
                    value="{{ item.qty }}"
                  />
                </td>
                <td>{{ item.Product.price * item.qty }}$</td>
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
            <h5>
              Total: <span class="price text-success"> {{ total }}$</span>
            </h5>
            <button type="button" class="btn btn-success" (click)="checkOut()">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-light" *ngIf="Checkout">
      <div class="container">
        <div
          class="row rows-col-md-2 rows-col-sm-1 rows-col-sx-1 gap-3 bg-light-subtle border rounded-5"
        >
          <div class="col-md-12 col-sm-12 col-lg-8 h-100">
            <div class="p-4 text-dark">
              <h5 class="text-center py-2  ">Cart</h5>
              <table class="table table-light p-4 border">
                <thead>
                  <tr>
                    <th scope="col" colspan="2">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of cartItem">
                    <td style="width: 18%;">
                      <img
                        src="{{ item.Product.image }}"
                        class="img-fluid img-thumbnail"
                        alt="Sheep"
                      />
                    </td>
                    <td>
                      {{ item.Product.name }}
                      <br />
                      <span class="fw-light">
                        {{ item.Product.description }}
                      </span>
                    </td>
                    <td>{{ item.Product.price }}$</td>
                    <td class="qty ">
                      {{ item.qty }}
                    </td>
                    <td>{{ item.Product.price * item.qty }}$</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="col h-100">
            <div class="p-4 text-dark">
              <div class="">
                <h5 class="text-center py-2 ">Info Customers</h5>
                <div class="border-top-0 d-flex justify-content-between">
                  <h5>
                    Total:
                    <span class="price text-success"> {{ total }}$</span>
                  </h5>
                </div>
                <p>
                  Name: <span class="fw-light">{{ infoCustomer?.name }}</span>
                </p>
                <p>
                  Email: <span class="fw-light">{{ infoCustomer?.email }}</span>
                </p>
              </div>
              <form>
                <div class="mb-3">
                  <label for="address" class="form-label">Address</label>
                  <textarea
                    type="text"
                    class="form-control"
                    #address
                    name="address"
                  ></textarea>
                </div>
                <div>
                  <button
                    class="btn btn-warning"
                    (click)="sendOrder(address.value)"
                  >
                    Send Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- products card  -->
    </section>
    <div
      id="liveToastBtn"
      class="toast-container position-fixed  top-50 end-0  p-3"
      style="bg-bs-opacity: 1"
    >
      <div
        id="liveToast"
        class="toast align-items-center text-dark bg-light border rournded-4 "
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div
          class="toast-header bg-warning  text-dark"
          style="bg-bs-opacity: 1;"
        >
          <strong class="me-auto" style="color: #521a4d;">BangDang</strong>
          <small>Notification </small>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body  bg-light">
          {{ message }}
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  infoCustomer: any | null = null;
  cart: Promise<void> | ShoppingSession[] = [];
  shoppingSessionId: string = '';
  total: number = 0;
  cartItem: Cart[] = [];
  message: string = '';
  Checkout = false;
  constructor() {
    this.load();
  }

  async load() {
    await trpc.cart.list.query().then((res) => {
      res.map((item) => {
        this.shoppingSessionId = item.id;
        this.cartItem = item.CartItem;
        this.total = item.CartItem.reduce(
          (total, item) => total + Number(item.Product.price * item.qty),
          0
        );
      });
    });
    await trpc.user.info.query().then((res) => {
      this.infoCustomer = res;
    });
    this.Checkout = false;
  }
  async updateQty(productId: string, qty: string) {
    if (Number(qty) <= 0) {
      this.deleteItem(productId);
      return;
    }
    await trpc.cart.updateQty
      .mutate({
        productId: productId,
        quantity: Number(qty),
        shoppingSessionId: this.shoppingSessionId,
      })
      .then(() => {
        this.message = 'Item updated successfully';
        this.openToast();
      })
      .catch((err) => {
        this.message = err.message;
        this.openToast();
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
        this.openToast();
      })
      .catch((err) => {
        this.message = err.message;
      });
    this.load();
  }

  async checkOut() {
    this.Checkout = true;
  }

  async sendOrder(address: string) {
    await trpc.cart.checkout
      .mutate({
        shoppingSessionId: this.shoppingSessionId,
        address: address,
      })
      .then(() => {
        this.message = 'Order sent successfully';
        this.openToast();
      })
      .catch((err) => {
        this.message = err.message;
        this.openToast();
      });
  }

  async clearCart() {
    await trpc.cart.removeCart
      .mutate({
        shoppingSessionId: this.shoppingSessionId,
      })
      .then(() => {
        this.message = 'Cart cleared successfully';
        this.openToast();
      })
      .catch((err) => {
        this.message = err.message;
        this.openToast();
      });

    this.load();
  }
  openToast() {
    const myToast = new bootstrap.Toast(
      document.getElementById('liveToast') as HTMLElement,
      {}
    );
    myToast.show();
  }

}
