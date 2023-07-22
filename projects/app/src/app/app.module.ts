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
import { ProjectComponent } from './page/project/index.component';
import { DetailTaskComponent } from './page/project/component/detailTask.component';
import { NewTaskComponent } from './page/project/component/newtask.component';
import { MemberComponent } from './page/project/component/member.component';
import { TaskComponent } from './page/project/component/task.component';
import { AuthModule } from 'auth';

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
    ProjectComponent,
    DetailTaskComponent,
    NewTaskComponent,
    MemberComponent,
    TaskComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthModule,
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
