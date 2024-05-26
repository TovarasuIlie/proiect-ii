import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  loading: boolean = true;
  paginatorConfig: PaginateConfig = {
    currentPageName: 'produse',
    totalItems: 10,
    itemsPerPage: 10,
    currentPage: 1
  }
  orders: OrderInterface[] = [];
  
  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, public userService: UserService, private orderService: OrderService,
              private formBuilder: FormBuilder) {
    this.titleService.setTitle("Comenzi active - La Verucu' SRL");
  }

  ngOnInit(): void {
    this.initializeOrders();
    this.initializeForm();
  }

  initializeOrders() {
    this.orderService.getAdminOrders().subscribe({
      next: (value) => {
        this.loading = false;
        this.orders = value;
      }
    })
  }

  initializeForm() {
    this.filterForm = this.formBuilder.group({
      itemsPerPage: [this.paginatorConfig.itemsPerPage],
      orderListType: ["ASC"]
    });
  }

  resultPerPageChange() {
    this.paginatorConfig.itemsPerPage = this.filterForm.get('itemsPerPage')?.value;
    const totalPages = Math.ceil(this.paginatorConfig.totalItems / this.paginatorConfig.itemsPerPage);
    if(this.paginatorConfig.currentPage > totalPages) {
      this.paginatorConfig.currentPage = totalPages
    }
    this.initializeOrders();
  }

  changePage(page: number) {
    this.paginatorConfig.currentPage = page;
    this.initializeOrders();
  }

  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.src = "/assets/js/index-page.js";
    this._renderer2.appendChild(this._document.body, script);
  }
}
