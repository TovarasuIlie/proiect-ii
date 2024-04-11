import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = "La Vericu' SRL";
  loading: boolean = false;
  showHeaderAndFooter: boolean = true;

  constructor(private userService: UserService, private router: Router) {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationStart) {
        if(ev.url.includes('/dashboard') || ev.url.includes('/eroarea-404') || ev.url.includes('/cosul-meu')) {
          this.showHeaderAndFooter = false;
        } else {
          this.showHeaderAndFooter = true;
        }
        if(ev.url.includes('/anvelope/')) {
          this.loading = true;
        }
      }
      if (ev instanceof NavigationEnd || ev instanceof NavigationCancel || ev instanceof NavigationError) {
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.refreshUser();
  }

  private refreshUser() {
    const jwt = this.userService.getJWT();
    if(jwt) {
      this.userService.refreshUser(jwt).subscribe({
        next: _ => {},
        error: _ => {
          this.userService.logOut();
        }
      });
    } else {
      this.userService.refreshUser(null).subscribe();
    }
  }
  
}
