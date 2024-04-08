import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../services/toast.service';
import { CategoryInterface } from '../../dashboard/models/category-interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  public currentPath: string = "";
  categories: CategoryInterface[] = [];

  constructor(private router: Router, public userService: UserService, private toastService: ToastService) {

  }

  ngOnInit(): void {
    this.router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd) {
        this.currentPath = event.url;
      }
    });
  }

  getCategories($event: any[]) {
    this.categories = $event;
  }

  logoutUser() {
    this.userService.logOut();
    this.toastService.show({title: "Delogare cu succes", message: "V-ati delogat cu succes!", classname: "text-success"});
  }
}