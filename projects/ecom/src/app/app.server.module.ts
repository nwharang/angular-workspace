import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

@NgModule({
  imports: [AppModule, ServerModule, ReactiveFormsModule, FormsModule],
  bootstrap: [MainLayoutComponent],
})
export class AppServerModule {}
