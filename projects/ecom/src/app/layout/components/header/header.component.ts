import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { trpc } from '~app/src/trpcClient';
import { AuthService } from '~ecom/src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  nav = false;
  input = true;
  isLogin = false;
  isAdmin = false;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.scrollY > 280) {
      this.nav = true;
    } else {
      this.nav = false;
    }
  }

  constructor(private authService: AuthService, private router: Router) {
    this.authService.isAuth.then((res) => {
      this.isLogin = res;
      this.isAdmin = this.authService.isAdmin;
    });
  }

  showInput() {
    this.input = !this.input;
  }

  logout() {
    trpc.auth.logout.mutate().then(() => {
      location.href = "/"
    });
  }
}
