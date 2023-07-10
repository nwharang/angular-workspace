import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trpc } from '~app/src/trpcClient';

@Component({
  selector: 'app-main',
  template: `<router-outlet></router-outlet> `,
})
export class MainComponent implements OnInit {
  constructor(private router: Router) {}
  async ngOnInit(): Promise<void> {
    await trpc.auth.authenticate.mutate().catch(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
