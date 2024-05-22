import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-wishlist-page',
  templateUrl: './wishlist-page.component.html',
  styleUrl: './wishlist-page.component.css'
})
export class WishlistPageComponent implements OnInit {
  currentPath: string = '';

  constructor(private router: Router, public userService: UserService, private title: Title) {
    this.title.setTitle("Contul meu - La Vericu' SRL");

  }
  ngOnInit(): void {
    this.router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd) {
        this.currentPath = event.url;
      }
    });
  }
}
