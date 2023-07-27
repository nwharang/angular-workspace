import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { CustomersComponent } from './customers/customers.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminComponent,
    ProductsComponent,
    OrdersComponent,
    CustomersComponent,
  ],
  imports: [AdminRoutingModule, CommonModule, FormsModule],
  providers: [],
})
export class AdminModule {}
