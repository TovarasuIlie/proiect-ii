import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { CategoriesService } from '../../services/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsInterface } from '../../models/products.model';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { CategoryInterface } from '../../models/category-interface';

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
  categories: CategoryInterface[] = [];
  id: string = '';
  editForm: FormGroup = new FormGroup([]);
  errorMessages: string[] = [];

  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, public userService: UserService, 
              private categoryService: CategoriesService, private formBuilder: FormBuilder, private productsService: ProductsService, private activedroute: ActivatedRoute,
              private router: Router, private toastService: ToastService) {
    this.titleService.setTitle("Dashboard - La Verucu' SRL");
    this.activedroute.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if(id) {
          this.id = id;
        }
      },
    });
  }

  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.src = "/assets/js/index-page.js";
    this._renderer2.appendChild(this._document.body, script);
  }

  ngOnInit(): void {
    this.initializeProduct();
    this.initializeForm();
    this.initializeCategories();
  }

  initializeProduct() {
    this.productsService.getProduct(this.id).subscribe({
      next: (value) => {
        this.product = value;
        this.product.technicalDetailsJson = JSON.parse(value.technicalDetailsJson);
        this.initializeForm();
      }
    })
  }

  initializeCategories() {
    this.categoryService.getCategories().subscribe({
      next: (value) => {
        this.categories = value;
      },
    })
  }

  initializeForm() {
    this.editForm = this.formBuilder.group({
      title: [this.product.title, [Validators.required]],
      description: [this.product.description, [Validators.required]],
      category: [this.product.category?.id, [Validators.required]],
      quantity: [this.product.quantity, [Validators.required]],
      price: [this.product.price, [Validators.required]]
    });
  }

  deteleProduct() {
    this.productsService.deleteProduct(parseInt(this.id)).subscribe({
      next: (response) => {
        this.toastService.show({title: "Produse sters cu succes!", message: "Produsul a fost sters cu succes!", classname: "text-success"});
        this.router.navigateByUrl('/dashboard/produse');
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  editProduct() {

  }
  
}
