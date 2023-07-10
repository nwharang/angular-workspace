import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './layout/main.component';
import { LoginComponent } from './page/login.component';
import { LocalizationPipe } from './Pipe/localization.pipe';
import { HomeComponent } from './page/home.component';

@NgModule({
  declarations: [
    MainComponent,
    LoginComponent,
    LocalizationPipe,
    HomeComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [MainComponent],
})
export class AppModule {}
