import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { FormGroup } from '@angular/forms';
import { PaginateConfig } from '../../../../models/paginate.model';
import { OrderInterface } from '../../../../models/order.model';
import { OrderService } from '../../../../services/order.service';

@Component({
  selector: 'app-active-orders',
  templateUrl: './active-orders.component.html',
  styleUrl: './active-orders.component.css'
})
export class ActiveOrdersComponent {
  filterForm: FormGroup = new FormGroup({});
  paginatorConfig: PaginateConfig = {
    currentPageName: 'produse',
    totalItems: 10,
    itemsPerPage: 10,
    currentPage: 1
  }
  orders: OrderInterface[] = [];
  
  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, public userService: UserService, private orderService: OrderService) {
    this.titleService.setTitle("Comenzi active - La Verucu' SRL");
  }

  ngOnInit(): void {
    this.initializeOrders();
  }

  initializeOrders() {
    this.orderService.getAdminOrders().subscribe({
      next: (value) => {
        this.orders = value;
      }
    })
  }

  resultPerPageChange() {
    this.paginatorConfig.itemsPerPage = this.filterForm.get('itemsPerPage')?.value;
    sessionStorage.setItem("paginatorConfig", JSON.stringify(this.paginatorConfig));
    const paginatorConfig = sessionStorage.getItem("paginatorConfig");
    if(paginatorConfig) {
      this.paginatorConfig = JSON.parse(paginatorConfig);
    }
    const totalPages = Math.ceil(this.paginatorConfig.totalItems / this.paginatorConfig.itemsPerPage);
    if(this.paginatorConfig.currentPage > totalPages) {
      this.paginatorConfig.currentPage = totalPages
    }
    this.initializeOrders();
  }

  changePage(page: number) {
    this.paginatorConfig.currentPage = page;
    sessionStorage.setItem('paginatorConfig', JSON.stringify(this.paginatorConfig));
    this.initializeOrders();
  }

  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.src = "/assets/js/index-page.js";
    this._renderer2.appendChild(this._document.body, script);
  }
}
