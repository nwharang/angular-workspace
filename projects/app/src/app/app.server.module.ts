import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { MainComponent } from './layout/main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [AppModule, ServerModule, FormsModule, ReactiveFormsModule],
  bootstrap: [MainComponent],
})
export class AppServerModule {}
