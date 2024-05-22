import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, Event, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { OrderInterface } from '../../../../models/order.model';
import { OrderService } from '../../../../services/order.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.css'
})
export class OrdersPageComponent implements OnInit {
  currentPath: string = '';
  orders: OrderInterface[] = [];

  constructor(public userService: UserService, private orderService: OrderService, private title: Title) {
    this.title.setTitle("Contul meu - La Vericu' SRL");
  }

  ngOnInit(): void {
    this.initializeOrders();
  }

  initializeOrders() {
    this.orderService.getOrders().subscribe({
      next: (value) => {
        this.orders = value;
      }
    })
  }
}
