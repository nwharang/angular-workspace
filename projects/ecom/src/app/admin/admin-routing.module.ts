import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    title: 'Admin Page - HeadPhone Store',
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      },
      {
        path: 'products',
        component: ProductsComponent,
        title: 'Products Page - HeadPhone Store'
      },
      {
        path: 'orders',
        component: OrdersComponent,
        title: 'Orders Page - HeadPhone Store'
      },
      {
        path: 'customers',
        component: OrdersComponent,
        title: 'Customers Page - HeadPhone Store'
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
