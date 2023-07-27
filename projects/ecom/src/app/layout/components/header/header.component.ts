import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  nav = false;
  input: boolean = true;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.scrollY > 280) {
      this.nav = true;
    } else {
      this.nav = false;
    }
  }

  constructor() {}

  ngOnInit(): void {}
  showInput() {
    this.input = !this.input;
  }
}
