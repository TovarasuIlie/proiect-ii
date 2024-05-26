import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { CategoriesService } from '../../services/categories.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductEditInterface, ProductsInterface } from '../../models/products.model';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { CategoryInterface } from '../../models/category-interface';
import { EmojiValidator } from '../../../../validators/emoji-input.validator';
import { environment } from '../../../../../environments/environment.development';
import { EngineInterface, MarkInterface, ModelInterface } from '../../../../models/car.model';
import { CarService } from '../../../../services/car.service';

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
  cars: string[] = [];
  marks: MarkInterface[][] = [];
  models: ModelInterface[][] = [];
  engines: EngineInterface[][] = [];
  categories: CategoryInterface[] = [];
  id: number = 0;
  editForm: FormGroup = new FormGroup([]);
  formSubmited: boolean = false;
  errorMessages: string[] = [];

  @ViewChild('closeModalEdit') closeEditModal: any;
  @ViewChild('closeModalDelete') closeDeleteModal: any;

  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, public userService: UserService, 
              private categoryService: CategoriesService, private formBuilder: FormBuilder, private productsService: ProductsService, private activedroute: ActivatedRoute,
              private router: Router, private toastService: ToastService, private carService: CarService) {
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
      next: (value: any) => {
        console.log(value.value);
        this.product = value.value.product;
        this.cars = value.value.cars;
        this.product.technicalDetailsJson = JSON.parse(value.value.product.technicalDetailsJson);
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
      partForCar: this.formBuilder.array([]),
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

  get partForCar() {
    return this.editForm.get('partForCar') as FormArray;
  }

  deleteItemCar(index: number) {
    this.partForCar.removeAt(index);
  }

  addItemCar() {
    const id = (this.editForm.get('partForCar') as FormArray).length;
    this.marks[id] = [];
    this.models[id] = [];
    this.engines[id] = [];
    this.initializeMarks(id);
    this.partForCar.push(this.formBuilder.group({
      mark: [0, [Validators.min(1)]],
      model: [0, [Validators.min(1)]],
      engine: [0, [Validators.min(1)]]
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
        const editProduct: ProductEditInterface = {
          id: this.id,
          title: this.editForm.get('title')?.value,
          description: this.editForm.get('description')?.value,
          technicalDetailsJson: (JSON.stringify(this.editForm.get('technicalDetailsJson')?.value)).replace('/', ''),
          category: selectedCategory,
          quantity: this.editForm.get('quantity')?.value,
          price: parseFloat(this.editForm.get('price')?.value.replace(",", ".")),
          folderName: "",
          partOfCar: this.createArrayOfCars(),
          photoNumber: 0
        };
        console.log(editProduct);
        this.productsService.editProduct(editProduct).subscribe({
          next: (response) => {
            this.closeEditModal.nativeElement.click();
            this.toastService.show({title: "Produsul editat!", message: "Produsul " + editProduct.title + " a fost editat cu succes!", classname: "text-success"});
            this.initializeProduct();
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
    return environment.apiUrl + '/SiteUploads/ShopImages/' + folderName + "/" + folderName + "_" + imageID + ".png";
  }

  initializeMarks(id:number) {
    this.carService.getMarks().subscribe({
      next: (value) => {
        this.marks[id] = value;
      }
    });
  }

  initializeModels(id:number, markID: number) {
    this.carService.getModels(markID).subscribe({
      next: (value) => {
        this.models[id] = value;
      }
    })
  }

  initializeEngines(id:number, modelID: number) {
    this.carService.getEngines(modelID).subscribe({
      next: (value) => {
        this.engines[id] = value;
      }
    })
  }

  getMark(id:number, $event: any) {
    this.initializeModels(id, $event.target.value);
    this.engines[id] = [];
  }

  getModel(id:number, $event: any) {
    this.initializeEngines(id, $event.target.value);
  }

  createArrayOfCars() {
    let cars: number[] = [];
    this.editForm.get('partForCar')?.value.forEach((element: any) => {
      cars.push(element.engine);
    });
    return cars;
  }
}
