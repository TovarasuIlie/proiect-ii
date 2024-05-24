import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { CategoriesService } from '../../services/categories.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { ProductsInterface } from '../../models/products.model';
import { PaginateConfig } from '../../../../models/paginate.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-products-page',
  templateUrl: './view-products-page.component.html',
  styleUrl: './view-products-page.component.css'
})
export class ViewProductsPageComponent implements OnInit {
  products: ProductsInterface[] = [];

  filterForm: FormGroup = new FormGroup({});
  paginatorConfig: PaginateConfig = {
    currentPageName: 'produse',
    totalItems: 10,
    itemsPerPage: 10,
    currentPage: 1
  }


  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, 
              public userService: UserService, private productsService: ProductsService, private formBuilder: FormBuilder, private router: ActivatedRoute) {
    this.titleService.setTitle("Dashboard - La Verucu' SRL");
  }
  ngOnInit(): void {
    this.initializeForm();
    this.initializeProducts();
    this.initializePagination();
  }

  initializeProducts() {
    const paginationConfig = sessionStorage.getItem("paginatorConfig");
    if(paginationConfig) {
      this.paginatorConfig = JSON.parse(paginationConfig);
    }
    this.productsService.getProductsPagination(this.paginatorConfig.currentPage, this.paginatorConfig.itemsPerPage).subscribe({
      next: (value) => {
        this.products = value;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  initializeForm() {
    this.filterForm = this.formBuilder.group({
      itemsPerPage: [this.paginatorConfig.itemsPerPage],
      orderListType: ["ASC"]
    })
  }

  initializePagination() {
    const paginatorConfig = sessionStorage.getItem("paginatorConfig");
    if(paginatorConfig && paginatorConfig.includes(this.router.snapshot.url[0].path)) {
        this.paginatorConfig = JSON.parse(paginatorConfig);
    } else {
      this.productsService.getProductsCount().subscribe({
        next: (value) => {
          this.paginatorConfig.totalItems = value;
        }
      });
    }
    const totalPages = Math.ceil(this.paginatorConfig.totalItems / this.paginatorConfig.itemsPerPage);
    if(this.paginatorConfig.currentPage >= totalPages) {
      this.paginatorConfig.currentPage = totalPages
    }
    sessionStorage.setItem('paginatorConfig', JSON.stringify(this.paginatorConfig));
  }

  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.src = "/assets/js/index-page.js";
    this._renderer2.appendChild(this._document.body, script);
  }

  resultPerPageChange() {
    this.paginatorConfig.itemsPerPage = this.filterForm.get('itemsPerPage')?.value;
    sessionStorage.setItem("paginatorConfig", JSON.stringify(this.paginatorConfig));
    const paginatorConfig = sessionStorage.getItem("paginatorConfig");
    if(paginatorConfig) {
      this.paginatorConfig = JSON.parse(paginatorConfig);
    }
    const totalPages = Math.ceil(this.paginatorConfig.totalItems / this.paginatorConfig.itemsPerPage);
    if(this.paginatorConfig.currentPage >= totalPages) {
      this.paginatorConfig.currentPage = totalPages
    }
    this.initializeProducts();
  }

  changePage(page: number) {
    this.paginatorConfig.currentPage = page;
    sessionStorage.setItem('paginatorConfig', JSON.stringify(this.paginatorConfig));
    this.initializeProducts();
  }

}
