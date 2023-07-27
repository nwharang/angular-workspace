import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '@prisma/client';
import { trpc } from '~ecom/src/trpcClient';

type TData = {
  page: number;
  allItem: number;
  items: Product[];
};

@Component({
  selector: 'app-products',
  template: `<section class=" text-dark mix-white-100 ">
    <div class="container py-5 mix-white-100 " style="--bs-bg-opacity: 0.5">
      <div class="row  row-cols-sm-2 row-cols-lg-2    ">
        <div class=" category col-sx-12 col-sm-12 col-lg-3  ">
          <!-- sidebav -->
          <div class="">
            <h2>Category</h2>
            <hr class="border-2 " />
            <ul class="list-group">
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                A list item
                <span class="badge bg-puple   rounded-pill">14</span>
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                A second list item
                <span class="badge bg-puple  rounded-pill">2</span>
              </li>

              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                A third list item
                <span class="badge bg-puple  rounded-pill">1</span>
              </li>
            </ul>
          </div>

          <div class="price pt-5">
            <!-- price filter -->
            <h2>Price</h2>
            <hr class="border-2 " style="color: #841667; opacity: 1;" />
            <p>The highest price is 910.00$</p>
            <div class="row">
              <div class="col">
                <input type="number" class="form-control" placeholder="From" />
              </div>
              <div class="col">
                <input type="number" class="form-control" placeholder="To" />
              </div>
            </div>
            <div class="d-grid my-2">
              <button href="#" class="btn">Filter</button>
            </div>
          </div>

          <div class="availability">
            <!-- availability filter -->
            <h2>Availability</h2>
            <hr class="border-2 " style="color: #841667; opacity: 1;" />
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="instock"
                style="color: #841667;"
              />
              <label class="form-check-label" for="instock">
                In stock (10)
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="outStock"
                checked
              />
              <label class="form-check-label" for="outStock">
                Out of stock (3)
              </label>
            </div>
          </div>
        </div>
        <div class="col-sx-12 col-sm-12 col-lg-9   products">
          <h2 class="text-center">Products</h2>
          <hr class="border-2 " style="opacity: 1; color: #841667;" />
          <div class="row row-cols-sm-2  row-cols-md-3 row-cols-lg-4 g-0  gx-3">
            <!-- products card  -->
            <div class="col mb-3 " *ngFor="let item of data?.items">
              <div class="card h-100 shadow-sm position-relative">
                <a href="product-detail/{{ item.id }}">
                  <img
                    class="w-100 p-2"
                    src="{{ item.image }}"
                    alt="{{ item.name }}"
                  />
                </a>
                <div class="position-absolute top-0 end-0">
                  <span class="deal rounded-pill m-3">10%</span>
                </div>
                <div class="card-body">
                  <div class="clearfix mb-3">
                    <span class="float-start badge rounded-pill bg-warning"
                      >{{ item.price }} $</span
                    >
                    <span
                      class=" float-end details  text-uppercase aff-link fw-bold"
                      >{{ item.unit }}</span
                    >
                  </div>
                  <h5 class="card-title " style="height: 10rem;">
                    <a href="product-detail/{{ item.id }}">{{ item.name }}</a>
                  </h5>
                  <div class="d-grid align-items-end">
                    <button href="#" class="btn btn-warning bold-btn">
                      ADD TO CARD
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- products card  -->
          </div>
        </div>
      </div>

      <ngb-pagination
        *ngIf="data"
        [(page)]="data.page"
        [pageSize]="1"
        [collectionSize]="data.allItem"
      ></ngb-pagination>
    </div>
  </section>`,
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  title = 'Products';
  depception = 'This is the products page';
  data: TData | null = null;

  constructor(private routerActive: ActivatedRoute) {
    this.load().then((data) => {
      console.log(data);

      this.data = data;
    });
  }
  async load(): Promise<TData> {
    const page = this.routerActive.snapshot.queryParams.page || 0;
    return trpc.product.list.query({
      page,
    });
  }
}
