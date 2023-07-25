import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HeaderComponent } from './layout/components/header/header.component';
import { FooterComponent } from './layout/components/footer/footer.component';
import { HeroComponent } from './layout/components/hero/hero.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { HeroNavComponent } from './layout/components/hero-nav/hero-nav.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AuthComponent } from './pages/auth/auth.component';
import { UserComponent } from './pages/user/user.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckOutComponent } from './pages/check-out/check-out.component';
import { AdminComponent } from './pages/admin/admin.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ProductDetailComponent } from './pages/productDetail/product-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    HomeComponent,
    ProductsComponent,
    CategoriesComponent,
    HeroNavComponent,
    BlogComponent,
    AuthComponent,
    UserComponent,
    CartComponent,
    CheckOutComponent,
    AdminComponent,
    PageNotFoundComponent,
    ProductDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [MainLayoutComponent
  ]
})
export class AppModule { }
