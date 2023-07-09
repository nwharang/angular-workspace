import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './layout/main.component';
import { DashboardComponent } from './page/dashboard.component';
import { LocalizationPipe } from './Pipe/localization.pipe';
import { InfoComponent } from './page/info.component';

@NgModule({
  declarations: [
    MainComponent,
    DashboardComponent,
    LocalizationPipe,
    InfoComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [MainComponent],
})
export class AppModule {}
