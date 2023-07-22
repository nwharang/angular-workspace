import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { MainComponent } from './layout/main.component';

@NgModule({
  imports: [AppModule, ServerModule, ReactiveFormsModule, FormsModule],
  bootstrap: [MainComponent],
})
export class AppServerModule {}
