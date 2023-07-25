import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-hero-nav',
  templateUrl: './hero-nav.component.html',
  styleUrls: ['./hero-nav.component.scss'],
})
export class HeroNavComponent implements OnInit,OnDestroy {
  pageTitles: string = '';
  depcription: string = '';
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
            } else if (
              child.snapshot.data &&
              child.snapshot.data['title'] &&
              child.snapshot.data['description']
            ) {
              return child.snapshot.data;
            } else {
              return null;
            }
          }
          return null;
        })
      )
      .subscribe((data: any) => {
        if (data) {
          this.pageTitles = data.title;
          this.depcription = data.description;
        }
      });
  }

  ngOnInit(): void { }
  ngOnDestroy(): void {
  }

}
