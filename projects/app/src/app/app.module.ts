import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './layout/main.component';
import { LoginComponent } from './page/login.component';
import { HomeComponent } from './page/home.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { RegisterComponent } from './page/register.component';
import { trpc } from '../trpcClient';
import { Observable, Observer } from 'rxjs';
import { Localize } from '@prisma/client';

export function HttpLoaderFactory() {
  class TranslationProviderService implements TranslateLoader {
    getTranslation(lang: Localize) {
      return Observable.create((observer: Observer<Buffer>) => {
        trpc.localize[lang as Localize].query().then((res) => {
          observer.next(res);
          observer.complete();
        });
      });
    }
  }
  return new TranslationProviderService();
}
@NgModule({
  declarations: [
    MainComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [MainComponent],
})
export class AppModule {}
