import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { CategoriesService } from '../../services/categories.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryInterface } from '../../models/category-interface';
import { ToastService } from '../../../shared/services/toast.service';
import { ProductsService } from '../../services/products.service';
import { ProductAddInterface } from '../../models/products.model';
import { VirtualAction } from 'rxjs';

@Component({
  selector: 'app-add-products-page',
  templateUrl: './add-products-page.component.html',
  styleUrl: './add-products-page.component.css'
})
export class AddProductsPageComponent implements OnInit {
  categories: CategoryInterface[] = [];
  // selectedCategory: CategoryInterface = {
  //   id: '',
  //   name: '',
  // };
  addProductForm: FormGroup = new FormGroup({});
  formSubmited: boolean = false;
  errorMessages: string[] = [];

  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, public userService: UserService, 
              private categoryService: CategoriesService, private formBuilder: FormBuilder, private toastService: ToastService, private productsService: ProductsService) {
    this.titleService.setTitle("Dashboard - La Verucu' SRL");
  }
  ngOnInit(): void {
    this.initializeCategories();
    this.initializeForm();
  }

  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.src = "/assets/js/index-page.js";
    this._renderer2.appendChild(this._document.body, script);
  }

  initializeCategories() {
    this.categoryService.getCategories().subscribe({
      next: (value) => {
        this.categories = value;
      }
    })
  }

  initializeForm() {
    this.addProductForm = this.formBuilder.group({
      title: [, [Validators.required, Validators.minLength(8)]],
      description: [, [Validators.required, Validators.minLength(10)]],
      category: [0, [Validators.required, Validators.min(1)]],
      quantity: [, [Validators.required, Validators.min(1)]],
      price: [, [Validators.required, Validators.pattern('[0-9]+.[0-9][0-9]')]],
      technicalDetailsJson: this.formBuilder.array([])
    })
  }

  get technicalDetailsJson() {
    return this.addProductForm.get('technicalDetailsJson') as FormArray;
  }

  deleteItem(index: number) {
    this.technicalDetailsJson.removeAt(index);
  }

  addItem() {
    this.technicalDetailsJson.push(this.formBuilder.group({
      specificationTitle: [,[Validators.required, Validators.minLength(3)]],
      specificationValue: [,[Validators.required]]
    }));
  }
  
  addNewProduct() {
    this.formSubmited = true;
    this.errorMessages = [];
    if(this.addProductForm.valid) {
      if((this.addProductForm.get('technicalDetailsJson') as FormArray).length >= 3) {
        const categoryId = parseInt(this.addProductForm.get('category')?.value, 10);
        const selectedCategory: CategoryInterface = this.categories.find(c => c.id === categoryId) || { 
          id: 0, 
          name: 'Categoria nu exista',
          imageFilename: 'categoria-nu-exista.png',
          categoryNameSearch: 'categoria-nu-exista'
        };
        const addProduct: ProductAddInterface = {
          title: this.addProductForm.get('title')?.value,
          description: this.addProductForm.get('description')?.value,
          technicalDetailsJson: (JSON.stringify(this.addProductForm.get('technicalDetailsJson')?.value)).replace('/', ''),
          category: selectedCategory,
          quantity: this.addProductForm.get('quantity')?.value,
          price: parseFloat(this.addProductForm.get('price')?.value.replace(",", "."))
        };
        console.log(addProduct);
        this.productsService.addNewProduct(addProduct).subscribe({
          next: (response: any) => {
            console.log(response);
            this.toastService.show({title: "Produs Adaugat!", message: "Produsul a fost adaugat cu succes!", classname: "text-success"});
          },
          error: (response) => {
            console.log(response);
          }
        })
      } else {
        this.errorMessages.push("Trebuie sa adaugi minim 3 specificatii produsului nou adaugat!");
      }
    } else {
      this.errorMessages.push("Toate campurile sunt obligatorii!");
    }
  }
}
