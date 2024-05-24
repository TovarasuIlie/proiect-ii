import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { CategoriesService } from '../../services/categories.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsInterface } from '../../models/products.model';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { CategoryInterface } from '../../models/category-interface';
import { EmojiValidator } from '../../../../validators/emoji-input.validator';

@Component({
  selector: 'app-products-details-page',
  templateUrl: './products-details-page.component.html',
  styleUrl: './products-details-page.component.css'
})
export class ProductsDetailsPageComponent implements OnInit {
  product: ProductsInterface = {
    id: -1,
    title: null,
    description: null,
    category: null,
    technicalDetailsJson: [],
    quantity: 0,
    price: null,
    folderName: "",
    photoNumber: 0
  };
  categories: CategoryInterface[] = [];
  id: number = 0;
  editForm: FormGroup = new FormGroup([]);
  formSubmited: boolean = false;
  errorMessages: string[] = [];

  @ViewChild('closeModalDelete') closeDeleteModal: any;

  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, public userService: UserService, 
              private categoryService: CategoriesService, private formBuilder: FormBuilder, private productsService: ProductsService, private activedroute: ActivatedRoute,
              private router: Router, private toastService: ToastService) {
    this.titleService.setTitle("Dashboard - La Verucu' SRL");
    this.activedroute.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if(id) {
          this.id = parseInt(id, 10);
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
      title: [this.product.title, [Validators.required, EmojiValidator.hasEmoji]],
      description: [this.product.description, [Validators.required, EmojiValidator.hasEmoji]],
      category: [this.product.category?.id, [Validators.required, EmojiValidator.hasEmoji]],
      quantity: [this.product.quantity, [Validators.required, EmojiValidator.hasEmoji, Validators.pattern("[0-9]*")]],
      price: [this.product.price?.toString(), [Validators.required, EmojiValidator.hasEmoji]],
      technicalDetailsJson: this.formBuilder.array([])
    });

    this.product.technicalDetailsJson.forEach((element: any) => {
      this.technicalDetailsJson.push(this.formBuilder.group({
        specificationTitle: [element.specificationTitle ,[Validators.required, Validators.minLength(3), EmojiValidator.hasEmoji]],
        specificationValue: [element.specificationValue,[Validators.required, EmojiValidator.hasEmoji]]
      }));
    });
  }

  deteleProduct() {
    this.productsService.deleteProduct(this.id).subscribe({
      next: (response) => {
        this.toastService.show({title: "Produse sters cu succes!", message: "Produsul a fost sters cu succes!", classname: "text-success"});
        this.closeDeleteModal.nativeElement.click();
        this.router.navigateByUrl('/dashboard/produse');
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  get technicalDetailsJson() {
    return this.editForm.get('technicalDetailsJson') as FormArray;
  }

  deleteItem(index: number) {
    this.technicalDetailsJson.removeAt(index);
  }
  
  addItem() {
    this.technicalDetailsJson.push(this.formBuilder.group({
        specificationTitle: [null, [Validators.required, Validators.minLength(3), EmojiValidator.hasEmoji]],
        specificationValue: [null, [Validators.required, EmojiValidator.hasEmoji]]
      }));
  }

  editProduct() {
    this.formSubmited = true;
    this.errorMessages = [];
    if((this.editForm.get('technicalDetailsJson') as FormArray).length >= 3) {
      if(this.editForm.valid) {
        const categoryId = parseInt(this.editForm.get('category')?.value, 10);
        const selectedCategory: CategoryInterface = this.categories.find(c => c.id === categoryId) || { 
          id: 0, 
          name: 'Categoria nu exista',
          imageFilename: 'categoria-nu-exista.png',
          categoryNameSearch: "categoria-nu-exista"
        };
        const editProduct: ProductsInterface = {
          id: this.id,
          title: this.editForm.get('title')?.value,
          description: this.editForm.get('description')?.value,
          technicalDetailsJson: (JSON.stringify(this.editForm.get('technicalDetailsJson')?.value)).replace('/', ''),
          category: selectedCategory,
          quantity: this.editForm.get('quantity')?.value,
          price: parseFloat(this.editForm.get('price')?.value.replace(",", ".")),
          folderName: "",
          photoNumber: 0
        };
        console.log(editProduct);
        this.productsService.editProduct(editProduct).subscribe({
          next: (response) => {
            this.toastService.show({title: "Produsul editat!", message: "Produsul " + editProduct.title + " a fost editat cu succes!", classname: "text-success"});
            this.initializeProduct();
            console.log(response);
          },
          error: (response) => {
            console.log(response);
          }
        })
      }
    } else {
        this.errorMessages.push("Trebuie sa ai minim 3 specificatii pentru acest obiect!");
    }
  }

  getImage(folderName:string, imageID: string) {
    return 'http://localhost:5020/SiteUploads/ShopImages/' + folderName + "/" + folderName + "_" + imageID + ".png";
  }
}
