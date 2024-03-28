import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { CategoriesService } from '../../services/categories.service';
import { FormBuilder } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { ProductsInterface } from '../../models/products.model';

@Component({
  selector: 'app-view-products-page',
  templateUrl: './view-products-page.component.html',
  styleUrl: './view-products-page.component.css'
})
export class ViewProductsPageComponent implements OnInit {
  products: ProductsInterface[] = [];
  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, public userService: UserService, private productsService: ProductsService) {
    this.titleService.setTitle("Dashboard - La Verucu' SRL");
  }
  ngOnInit(): void {
    this.initializeProducts();
  }

  initializeProducts() {
    this.productsService.getProducts().subscribe({
      next: (value) => {
        this.products = value;
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.src = "/assets/js/index-page.js";
    this._renderer2.appendChild(this._document.body, script);
  }



}
