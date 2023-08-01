/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderStatus, Prisma } from '@prisma/client';
import { trpc } from '~app/src/trpcClient';
const CartItemWithProduct = Prisma.validator<Prisma.OrderArgs>()({
  include: {
    ShoppingSession: { include: { CartItem: { include: { Product: true } } } },
  },
});
type Cart = Prisma.OrderGetPayload<typeof CartItemWithProduct>;

const CartItemProduct = Prisma.validator<Prisma.CartItemArgs>()({
  include: { Product: true },
});
type CartItemArgs = Prisma.CartItemGetPayload<typeof CartItemProduct>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare var bootstrap: any;

@Component({
  selector: 'app-orders',
  template: `
    <section>
      <div class="d-flex justify-content-between">
        <h1 class="text-warning">Orders</h1>
      </div>
      <div class="table-responsive">
        <table class="table table-primary table-dark table-striped">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Create At</th>
              <th scope="col">Address</th>
              <th scope="col">Total</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of orderItems; let i = index">
              <th scope="row">{{ i + 1 }}</th>
              <td>{{ item.address }}</td>
              <td>{{ item.createdAt | date : 'dd/MM/yyyy' }}</td>
              <td>{{ item.total }}$</td>
              <td>{{ item.status }}</td>
              <td>
                <button (click)="getDetail(item)">detail</button>
                <button class="btn btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div
      class="modal"
      id="modalDetail"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal Details</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
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
                      <tr *ngFor="let item of cartItemsDetail; let i = index">
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
                  <div class="" *ngFor="let item of orderDetail">
                    <h5 class="text-center py-2 ">Info Customers</h5>
                    <div class="border-top-0 d-flex justify-content-between">
                      <h5>
                        Total:
                        <span class="price text-success"> Tong cong o day</span>
                      </h5>
                      <span class="badge bg-primary"></span>
                    </div>
                  </div>
                  <form>
                    <div class="mb-3">
                      <label for="address" class="form-label">Address</label>
                    </div>
                    <div>
                      <button class="btn btn-warning">Send Order</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OrdersComponent {
  orderItems: any[] = [];
  orderDetail: Cart[] = [];

  cartItemsDetail: CartItemArgs[] = [];
  orderStatus: OrderStatus[] = ['InProgress', 'Completed', 'Canceled'];
  constructor() {
    this.load();
  }

  async load() {
    await trpc.cart.getListOrders.query().then((res) => {
      res.map((item) => {
        this.orderItems.push(item);
      });
    });
    console.log(this.orderItems);
  }
  onSubmit(frm: NgForm) {
    console.log(frm);
  }

  getDetail(item: Cart) {
    console.log(item);
    this.orderDetail = item.ShoppingSession as unknown as Cart[];
    this.openModal();
    console.log(this.orderDetail);
  }

  openModal() {
    const myModal = new bootstrap.Modal(document.getElementById('modalDetail'));
    myModal.show();
  }
}
