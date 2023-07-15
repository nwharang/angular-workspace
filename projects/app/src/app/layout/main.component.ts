import { Component, OnInit } from '@angular/core';
import { trpc } from '~app/src/trpcClient';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { Localize } from '@prisma/client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i class="fas fa-bars"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <!-- Navbar brand -->
          <a class="navbar-brand mt-2 mt-lg-0 comingsoon fw-bolder" href="#">
            Ten Trang Web
          </a>
          <!-- Left links -->
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li *ngFor="let item of navList">
              <a
                [routerLink]="[item.url]"
                routerLinkActive="btn-outline-primary"
                class="btn"
              >
                {{ item.text | translate }}
              </a>
            </li>
          </ul>
          <!-- Left links -->
        </div>
        <form class="d-flex input-group w-auto gap-3 align-items-center">
          <span class="input-group-text border-0" id="search-addon">
            <input
              #searchParam
              type="search"
              class="form-control rounded"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="search-addon"
            />
            <button
              (click)="search(searchParam.value)"
              class="btn btn-outline-primary ms-2"
            >
              <i class="fas fa-search"></i>
            </button>
          </span>
          <div>
            <ng-container *ngIf="authService.isAuth; else elseTemplate">
              <button type="button" class="btn btn-primary" (click)="logout()">
                {{ 'SignOut' | translate }}
              </button>
            </ng-container>
            <ng-template #elseTemplate>
              <button type="button" class="btn btn-primary" (click)="login()">
                {{ 'SignIn' | translate }}
              </button>
            </ng-template>
          </div>
          <label>
            <button
              (click)="changeLanguage(translate.currentLang)"
              class="btn btn-outline-primary"
            >
              {{ translate.currentLang | uppercase }}
            </button>
          </label>
        </form>
      </div>
    </nav>
    <router-outlet />
  `,
  styles: ['.comingsoon {font-family : "Coming Soon"}'],
})
export class MainComponent implements OnInit {
  public navList = [
    { url: '/home', text: 'Home' },
    { url: '/project', text: 'Project' },
    { url: '/team', text: 'Team' },
  ];
  constructor(
    public translate: TranslateService,
    public authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.initTranslating();
  }
  initTranslating() {
    this.translate.addLangs(['en', 'vi']);
    try {
      this.translate.setDefaultLang('en');
      this.translate.use(this.authService.localize);
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }

  async changeLanguage(lang: string): Promise<void> {
    try {
      this.translate.use(lang == 'en' ? 'vi' : 'en');
      await trpc.user.changeLocalize.mutate({
        localize: lang == 'en' ? 'vi' : ('en' as Localize),
      });
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }

  async logout() {
    await trpc.auth.logout.mutate().then(() => {
      location.reload();
    });
  }
  async login() {
    await this.router.navigate(['/auth/login']);
  }

  async search(param: string) {
    console.log(param);
  }

  async navigate(value: string) {
    console.log(value);
    this.router.navigate([value]);
  }
}
