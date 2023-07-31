import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AuthComponent } from './pages/auth/auth.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductDetailComponent } from './pages/productDetail/product-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home Page - HeadPhone Store',
    data: {
      title: 'Home Page - HeadPhone Store',
      description: 'This is the description of the Home Page',
    },
  },
  {
    path: 'products',
    component: ProductsComponent,
    title: 'Products Page - HeadPhone Store',
    data: {
      title: 'Products Page - HeadPhone Store',
      description: 'This is the description of the Products Page',
    },
  },
  {
    path: 'blog',
    component: BlogComponent,
    title: 'Blog Page - HeadPhone Store',
    data: {
      title: 'Blog Page - HeadPhone Store',
      description: 'This is the description of the Blog Page',
    },
  },
  {
    path: 'auth',
    component: AuthComponent,
    title: 'Auth Page - HeadPhone Store',
    data: {
      title: 'Auth Page - HeadPhone Store',
      description: 'This is the description of the Auth Page',
    },
  },
  {
    path: 'user',
    component: AuthComponent,
    title: 'User Page - HeadPhone Store',
    data: {
      title: 'User Page - HeadPhone Store',
      description: 'This is the description of the User Page',
    },
  },
  {
    path: 'cart',
    component: CartComponent,
    title: 'Cart Page - HeadPhone Store',
    data: {
      title: 'Cart Page - HeadPhone Store',
      description: 'This is the description of the Cart Page',
    },
  },
  {
    path: 'product-detail/:id',
    component: ProductDetailComponent,
    title: 'Product Detail Page - HeadPhone Store',
    data: {
      title: 'Product Detail Page - HeadPhone Store',
      description: 'This is the description of the Product Detail Page',
    },
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    title: 'Admin Page - HeadPhone Store',
    data: {
      title: 'Admin Page - HeadPhone Store',
      description: 'This is the description of the Admin Page',
    },
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'Page Not Found - HeadPhone Store',
    data: {
      title: 'Page Not Found - HeadPhone Store',
      description: 'This is the description of the Page Not Found',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
