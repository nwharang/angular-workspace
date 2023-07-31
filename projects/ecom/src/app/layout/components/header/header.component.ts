/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '~ecom/src/app/services/auth.service';

declare var bootstrap: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  nav = false;
  input: boolean = true;
  isLogin: boolean = false;
  showCartModal: boolean = false;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.scrollY > 280) {
      this.nav = true;
    } else {
      this.nav = false;
    }
  }

  constructor(private authService: AuthService) {
    this.isLogin = this.authService.isAuth;
    this.showCartModal = false;
  }

  ngOnInit(): void {}
  showInput() {
    this.input = !this.input;
  }

  logout() {
    this.authService.logout();
  }
  showCart(id: string) {
    const eleModal = document.getElementById(id);
    if (eleModal) {
      let myModal = bootstrap.Modal.getInstance(eleModal);
      if (!myModal) {
        myModal = new bootstrap.Modal(eleModal, {});
      }
      myModal.show();
    }
  }
}
