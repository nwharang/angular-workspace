import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trpc } from '~app/src/trpcClient';
import { TranslateService } from '@ngx-translate/core';
import { Localize } from '@prisma/client';
@Component({
  selector: 'app-main',
  template: `
    <router-outlet>
      <label>
        <select #langSelect (change)="changeLanguage(langSelect.value)">
          <option
            *ngFor="let lang of translate.getLangs()"
            [value]="lang"
            [selected]="lang === translate.currentLang"
          >
            {{ lang }}
          </option>
        </select>
      </label>
    </router-outlet>
  `,
})
export class MainComponent implements OnInit {
  constructor(private router: Router, public translate: TranslateService) {}
  async ngOnInit(): Promise<void> {
    this.translate.addLangs(['en', 'vi']);
    const { localize } = (await trpc.auth.authenticate.mutate().catch(() => {
      this.router.navigate(['/auth/login']);
    })) as unknown as { localize: string };

    this.translate.setDefaultLang('en');
    this.translate.use(localize ? localize : 'en');
  }

  async changeLanguage(lang: string): Promise<void> {
    this.translate.use(lang);
    await trpc.user.changeLocalize.mutate({ localize: lang as Localize });
  }
}
