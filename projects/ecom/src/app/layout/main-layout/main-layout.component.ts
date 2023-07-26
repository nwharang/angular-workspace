import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  url: string = '';
  showHeroNav: boolean = false;
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;

        if (this.url === '/home') {
          this.showHeroNav = true;
        } else {
          this.showHeroNav = false;
        }
      }
    });
  }
  ngOnInit(): void {}
}
