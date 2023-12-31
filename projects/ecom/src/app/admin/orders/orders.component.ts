/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
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
              <th scope="col">ID</th>
              <th scope="col">Create At</th>
              <th scope="col">Address</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of orderItems; let i = index">
              <th scope="row">{{ i + 1 }}</th>
              <td>{{ item.id }}</td>
              <td>{{ item.createdAt | date : 'dd/MM/yyyy' }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.status }}</td>
              <td class="d-flex">
                <button class="btn btn-warning" (click)="getDetail(item)">
                  Detail
                </button>
                <button class="btn btn-danger" (click)="deleteOrder(item.id)">
                  Delete
                </button>
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
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-dark">Modal Details</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div
              class="row rows-col-md-2 rows-col-sm-1 rows-col-sx-1 gap-1 bg-light-subtle "
            >
              <div class="col-md-12 col-sm-12 col-lg-8 h-100">
                <div class="p-4 text-dark">
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
                <div>
                  <div class="text-dark">
                    <div class="">
                      <h5 class="text-center py-2 ">Info Customers</h5>
                      <div
                        class="border-top-0 d-flex flex-column justify-content-between"
                      >
                        <p>
                          <span for="address" class="fw-bold">Name: </span>
                          {{ infoCustomer?.name }}
                        </p>
                        <p>
                          <span for="address" class="fw-bold">Email: </span>
                          {{ infoCustomer?.email }}
                        </p>
                        <p>
                          <span for="address" class="fw-bold">Total: </span
                          >{{ orderDetail.total }}$
                        </p>
                        <p>
                          <span for="address" class="fw-bold">Status: </span>
                          <select name="" id="">
                            <option
                              *ngFor="let item of orderStatus"
                              [value]="item"
                              [selected]="item === orderDetail.status"
                              (change)="updateOrderStatus(item)"
                              (click)="updateOrderStatus(item)"
                            >
                              {{ item }}
                            </option>
                          </select>
                        </p>
                        <p>
                          <span for="address" class="fw-bold">Address:</span>
                          {{ orderDetail.address }}
                        </p>
                        <p>
                          <span for="address" class="fw-bold">Create at: </span>
                          {{ orderDetail.createdAt | date : 'dd/MM/yyyy' }}
                        </p>
                        <p>
                          <span for="address" class="fw-bold"
                            >Last updated:</span
                          >
                          {{ orderDetail.updatedAt | date : 'dd/MM/yyyy' }}
                        </p>
                      </div>
                    </div>
                    <div class="mb-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="closeModal()"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="toast-container position-fixed bottom-0 end-0 p-3"
      style="--bs-bg-opacity:1"
    >
      <div
        id="liveToast"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header  text-dark">
          <strong class="me-auto">BangDang</strong>
          <small>Notification </small>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body  bg-dark">
          {{ message }}
        </div>
      </div>
    </div>
  `,
})
export class OrdersComponent {
  infoCustomer: any | null = null;
  orderItems: any[] = [];
  message: string = '';
  orderDetail: {
    id: string;
    createdAt: Date;
    address: string;
    total: number;
    status: string;
    updatedAt: Date;
  } = {
    id: '',
    createdAt: new Date(),
    address: '',
    total: 0,
    status: '',
    updatedAt: new Date(),
  };
  cartItemsDetail: CartItemArgs[] = [];
  orderStatus: OrderStatus[] = ['InProgress', 'Completed', 'Canceled'];
  constructor() {
    this.load();
  }

  async load() {
    await trpc.cart.getListOrders.query().then((res) => {
      this.orderItems = res as any;
    });
    
  }

  getDetail(item: Cart) {
    this.orderDetail = item as any;
    console.log(this.orderDetail);
    this.getUserById(item.ShoppingSession!.userId);
    console.log(this.infoCustomer);

    this.cartItemsDetail = item.ShoppingSession!.CartItem;
    this.orderDetail.total = this.cartItemsDetail.reduce(
      (a, b) => a + Number(b.qty * b.Product.price),
      0
    );
    this.openModal();
  }
  openModal() {
    const myModal = new bootstrap.Modal(document.getElementById('modalDetail'));
    myModal.show();
  }

  closeModal() {
    const eleModal = document.getElementById('modalDetail');
    if (eleModal) {
      let myModal = bootstrap.Modal.getInstance(eleModal);
      if (!myModal) {
        myModal = new bootstrap.Modal(eleModal, {});
      }
      myModal.toggle();
    }
  }
  updateOrderStatus(status: string) {
    trpc.cart.updateOrderStatus
      .mutate({
        orderId: this.orderDetail.id,
        status: status as OrderStatus,
      })
      .then(() => {
        this.message = 'Update status success';
        this.openToast();
        this.closeModal();
      })
      .catch((err) => {
        this.message = err.message;
        this.openToast();
      })
      .finally(() => {
        this.load();
      });
  }

  deleteOrder(orderId: string) {
    trpc.cart.deleteOrder
      .mutate({ orderId })
      .then(() => {
        this.message = 'Delete order success';
        this.openToast();
      })
      .catch((err) => {
        this.message = err.message;
        this.openToast();
      })
      .finally(() => {
        this.load();
      });
  }

  openToast() {
    const myToast = new bootstrap.Toast(
      document.getElementById('liveToast') as HTMLElement,
      {}
    );
    myToast.show();
  }
  async getUserById(id: string) {
    await trpc.user.getUserbyId
      .mutate({
        id: id,
      })
      .then((res) => {
        this.infoCustomer = res;
      });
    return null;
  }

}
