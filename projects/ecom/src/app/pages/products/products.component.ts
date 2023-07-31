import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '@prisma/client';
import { trpc } from '~ecom/src/trpcClient';
import { CartService } from '../../services/cart.service';

type TData = {
  allItem: number;
  items: Product[];
};

@Component({
  selector: 'app-products',
  template: `<section class=" text-dark mix-white-100 ">
    <div class="container py-5 mix-white-100 " style="--bs-bg-opacity: 0.5">
      <!-- Filter -->
      <div class="d-flex justify-content-end gap-5">
        <div class="input-group mb-3">
          <input #search type="text" class="form-control" />
          <button
            class="btn btn-outline-primary"
            type="button"
            (click)="handlerFilter(search.value)"
          >
            Search
          </button>
        </div>
        <div class="mb-3">
          <!-- <button class="btn btn-primary">Sort</button> -->
          <div class="dropdown">
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Sort
            </button>
            <ul class="dropdown-menu">
              <li>
                <button class="dropdown-item" (click)="handlerSort(0)">
                  Price Asc
                </button>
              </li>
              <li>
                <button class="dropdown-item" (click)="handlerSort(1)">
                  Price Desc
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- Filter -->

      <div class="col-sx-12 col-sm-12  products">
        <h2>Products</h2>
        <div class="row row-cols-sm-2  row-cols-md-3 row-cols-lg-5  g-0  gx-3">
          <!-- products card  -->
          <div class="col mb-3 " *ngFor="let item of productList">
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
                <h5 class="card-title fs-5 " style="height: 8rem;">
                  <a href="product-detail/{{ item.id }}">{{ item.name }}</a>
                </h5>
                <div class="d-grid align-items-end">
                  <button
                    class="btn btn-warning bold-btn"
                    (click)="addToCart(item.id)"
                  >
                    ADD TO CARD
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- products card  -->
        </div>
        <ngb-pagination
          *ngIf="data"
          [pageSize]="20"
          [collectionSize]="data.allItem"
          (pageChange)="pageChange($event)"
          class="container d-flex justify-content-center"
        />
      </div>
    </div>
  </section>`,
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  title = 'Products';
  depception = 'This is the products page';
  productList: Product[] = [];
  data: TData | null = null;
  page: number = 1;
  filterCase: {
    string: string | null;
    sort: number | null;
  } = {
    string: null,
    sort: null,
  };
  constructor(
    private routerActive: ActivatedRoute,
    private cartService: CartService
  ) {
    this.load();
  }
  async load(): Promise<void> {
    trpc.product.list
      .query({
        page: this.page,
        filter: this.filterCase || undefined,
      })
      .then((res) => {
        this.productList = res.items;
        this.data = res;
      });
  }

  pageChange(page: number) {
    this.page = page;
    this.load();
  }

  handlerFilter(searchParam: string): void {
    this.filterCase.string = searchParam;
    this.load();
  }
  handlerSort(number: number) {
    this.filterCase.sort = number;
    this.load();
  }

  async addToCart(id: string) {
    this.cartService.addToCart(id);
  }
}
