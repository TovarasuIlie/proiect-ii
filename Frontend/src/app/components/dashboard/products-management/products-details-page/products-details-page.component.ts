import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { CategoriesService } from '../../services/categories.service';
import { FormBuilder } from '@angular/forms';
import { ProductsInterface } from '../../models/products.model';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-details-page',
  templateUrl: './products-details-page.component.html',
  styleUrl: './products-details-page.component.css'
})
export class ProductsDetailsPageComponent implements OnInit {
  product: ProductsInterface = {
    id: null,
    title: null,
    description: null,
    category: null,
    technicalDetailsJson: null,
    quantity: null,
    price: null
  };
  id: string = '';
  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, public userService: UserService, 
              private categoryService: CategoriesService, private formBuilder: FormBuilder, private productsService: ProductsService, private activedroute: ActivatedRoute) {
    this.titleService.setTitle("Dashboard - La Verucu' SRL");
  }

  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.src = "/assets/js/index-page.js";
    this._renderer2.appendChild(this._document.body, script);
  }

  ngOnInit(): void {
    this.activedroute.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if(id) {
          this.id = id;
        }
      },
    });
    this.initializeProduct();
  }

  initializeProduct() {
    this.productsService.getProduct(this.id).subscribe({
      next: (value) => {
        this.product = value;
        this.product.technicalDetailsJson = JSON.parse(value.technicalDetailsJson);
        console.log(this.product);
      }
    })
  }
  
}
