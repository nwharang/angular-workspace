import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { trpc } from '~app/src/trpcClient';

@Component({
  selector: 'app-main',
  template: `<router-outlet></router-outlet> `,
})
export class MainComponent {
  constructor(private router: Router) {}
}
