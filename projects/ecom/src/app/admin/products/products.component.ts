import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Product } from '@prisma/client';
import { trpc } from '~ecom/src/trpcClient';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
declare let bootstrap: any;
@Component({
  selector: 'app-products',
  template: ` <section>
    <div class="d-flex justify-content-between">
      <h1 class="text-warning">Products</h1>
      <!-- Button trigger modal -->
      <button
        type="button"
        class="btn btn-outline-warning"
        (click)="addProduct()"
      >
        Add Product
      </button>

      <!-- Modal -->
      <div class="modal " id="addProduct" tabindex="-1">
        <div class="modal-dialog ">
          <form
            class="modal-content bg-dark"
            #frm="ngForm"
            (ngSubmit)="onSubmit(frm)"
          >
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="modalLabel">{{ titleModal }}</h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                  type="text"
                  [(ngModel)]="product.name"
                  #name="ngModel"
                  required
                  minlength="3"
                  name="name"
                  class="form-control"
                  aria-describedby="helpId"
                />
                <div *ngIf="name.invalid && name.touched" class="text-danger">
                  <div *ngIf="name.errors?.required">Name is required</div>
                  <div *ngIf="name.errors?.minlength">
                    Name must be at least 3 characters
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <input
                  type="text"
                  [(ngModel)]="product.description"
                  name="description"
                  #description="ngModel"
                  required
                  minlength="3"
                  class="form-control"
                  aria-describedby="helpId"
                />
                <div
                  *ngIf="description.invalid && description.touched"
                  class="text-danger"
                >
                  <div *ngIf="description.errors?.required">
                    Description is required
                  </div>
                  <div *ngIf="description.errors?.minlength">
                    Description must be at least 3 characters
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Image</label>
                <input
                  type="text"
                  [(ngModel)]="product.image"
                  name="description"
                  #description="ngModel"
                  required
                  minlength="3"
                  class="form-control"
                  aria-describedby="helpId"
                />
                <div
                  *ngIf="description.invalid && description.touched"
                  class="text-danger"
                >
                  <div *ngIf="description.errors?.required">
                    Description is required
                  </div>
                  <div *ngIf="description.errors?.minlength">
                    Description must be at least 3 characters
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="unit" class="form-label">Brand</label>
                <input
                  type="text"
                  [(ngModel)]="product.unit"
                  name="unit"
                  #unit="ngModel"
                  required
                  minlength="3"
                  class="form-control"
                  aria-describedby="helpId"
                />
                <div *ngIf="unit.invalid && unit.touched" class="text-danger">
                  <div *ngIf="unit.errors?.required">Brand is required</div>
                  <div *ngIf="unit.errors?.minlength">
                    Brand must be at least 3 characters
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input
                  type="number"
                  [(ngModel)]="product.price"
                  name="price"
                  #price="ngModel"
                  required
                  minlength="1"
                  class="form-control"
                  aria-describedby="helpId"
                />
                <div *ngIf="price.invalid && price.touched" class="text-danger">
                  <div *ngIf="price.errors?.required">Price is required</div>
                  <div *ngIf="price.errors?.minlength">
                    Price must be at least 3 characters
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
              <button type="submit" class="btn btn-warning">
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-primary table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">Stt</th>
            <th scope="col">Product Name</th>
            <th scope="col">Image</th>
            <th scope="col">Brand</th>
            <th scope="col">Price</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr class="" *ngFor="let item of productList; let i = index">
            <th scope="row">{{ i + 1 }}</th>
            <td>{{ item.name }}</td>
            <td>
              <img src="{{ item.image }}" alt="" width="50rem" />
            </td>
            <td>{{ item.unit }}</td>
            <td>{{ item.price }}</td>
            <td>
              <button
                type="button"
                class="btn btn-outline-warning"
                (click)="updateProduct(item)"
              >
                Edit
              </button>
              <button
                type="button"
                class="btn btn-outline-danger"
                (click)="deleteProduct(item.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="toast-container position-fixed bg-dark bottom-0 end-0 p-3">
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
  </section>`,
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  product: Product = {} as Product;
  titleModal = 'Add Product';
  message = '';
  productList: Product[] = [];
  constructor() {
    this.load();
  }
  async load(): Promise<void> {
    trpc.product.list
      .query({
        page: 1,
        filter: {
          string: '',
          sort: 0,
        },
        isAll: true,
      })
      .then((res) => {
        this.productList = res.items;
      });
  }
  onSubmit(frm: NgForm) {
    if (frm.valid) {
      if (this.product.id) {
        trpc.product.update
          .mutate({
            id: this.product.id,
            name: this.product.name,
            description: this.product.description || '',
            image: this.product.image || '',
            unit: this.product.unit,
            price: BigInt(this.product.price),
          })
          .then((res) => {
            this.message = `Update product ${res.name} success`;
            this.closeModal();
            this.load();
          });
      } else {
        trpc.product.create
          .mutate({
            name: this.product.name,
            description: this.product.description || '',
            image: this.product.image || '',
            unit: this.product.unit,
            price: BigInt(this.product.price),
          })
          .then((res) => {
            this.message = `Add product ${res.name} success`;
            this.openToast();
            this.closeModal();
            this.load();
          })
          .catch((err) => {
            this.message = err.message;
            this.openToast();
          });
      }
    }
  }
  deleteProduct(id: string) {
    trpc.product.delete
      .mutate({
        id,
      })
      .then((res) => {
        this.message = `Delete product ${res.name} success`;
        this.openToast();
        this.load();
      })
      .catch((err) => {
        this.message = err.message;
        this.openToast();
      });
  }

  updateProduct(item: Product) {
    this.titleModal = 'Edit Product';
    this.product = item;
    this.openModal();
  }
  addProduct() {
    this.titleModal = 'Add Product';
    this.product = {} as Product;
    this.openModal();
  }

  openModal() {
    const myModal = new bootstrap.Modal(
      document.getElementById('addProduct') as HTMLElement,
      {
        keyboard: false,
      }
    );
    myModal.show();
  }
  closeModal() {
    const eleModal = document.getElementById('addProduct');
    if (eleModal) {
      let myModal = bootstrap.Modal.getInstance(eleModal);
      if (!myModal) {
        myModal = new bootstrap.Modal(eleModal, {});
      }
      myModal.toggle();
    }
  }

  openToast() {
    const myToast = new bootstrap.Toast(
      document.getElementById('liveToast') as HTMLElement,
      {}
    );
    myToast.show();
  }
}
