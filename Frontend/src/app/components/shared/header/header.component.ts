import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  public currentPath: string = "";

  constructor(private router: Router, public userService: UserService) {

  }

  ngOnInit(): void {
    this.router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd) {
        this.currentPath = event.url;
      }
    });
  }

  logoutUser() {
    this.userService.logOut();
  }
}