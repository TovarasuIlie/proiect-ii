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
import { EmojiValidator } from '../../../../validators/emoji-input.validator';
import { CarService } from '../../../../services/car.service';
import { EngineInterface, MarkInterface, ModelInterface } from '../../../../models/car.model';

@Component({
  selector: 'app-add-products-page',
  templateUrl: './add-products-page.component.html',
  styleUrl: './add-products-page.component.css'
})
export class AddProductsPageComponent implements OnInit {
  categories: CategoryInterface[] = [];
  pondOptions = {
    class: 'my-filepond',
    multiple: true,
    labelIdle: '<u>Drag & Drop</u> or <u>Browse</u> images here!',
    acceptedFileTypes: 'image/jpeg, image/png, image/jpg',
  }
  marks: MarkInterface[][] = [];
  models: ModelInterface[][] = [];
  engines: EngineInterface[][] = [];
  addProductForm: FormGroup = new FormGroup({});
  formSubmited: boolean = false;
  errorMessages: string[] = [];
  imageArray: File[] = [];

  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, public userService: UserService, 
              private categoryService: CategoriesService, private formBuilder: FormBuilder, private toastService: ToastService, private productsService: ProductsService,
              private carService: CarService) {
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
      title: [, [Validators.required, Validators.minLength(8), EmojiValidator.hasEmoji]],
      description: [, [Validators.required, Validators.minLength(10), EmojiValidator.hasEmoji]],
      category: [0, [Validators.required, Validators.min(1), EmojiValidator.hasEmoji]],
      quantity: [, [Validators.required, Validators.min(1), Validators.pattern('[0-9]*'), EmojiValidator.hasEmoji]],
      price: [, [Validators.required, Validators.pattern('[0-9]+.[0-9][0-9]'), EmojiValidator.hasEmoji]],
      technicalDetailsJson: this.formBuilder.array([]),
      partForCar: this.formBuilder.array([]),
      image: [[]]
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
      specificationTitle: [,[Validators.required, Validators.minLength(3), EmojiValidator.hasEmoji]],
      specificationValue: [,[Validators.required, EmojiValidator.hasEmoji]]
    }));
  }

  get partForCar() {
    return this.addProductForm.get('partForCar') as FormArray;
  }

  deleteItemCar(index: number) {
    this.partForCar.removeAt(index);
  }

  addItemCar() {
    const id = (this.addProductForm.get('partForCar') as FormArray).length;
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
          price: parseFloat(this.addProductForm.get('price')?.value.replace(",", ".")),
          partForCar: this.createArrayOfCars(),
          image: this.addProductForm.get('image')?.value
        };
        this.productsService.addNewProduct(addProduct).subscribe({
          next: (response: any) => {
            this.resetForm();
            this.toastService.show({title: "Produs Adaugat!", message: "Produsul a fost adaugat cu succes!", classname: "text-success"});
          },
          error: (response) => {
            console.log(response);
            this.errorMessages.pop();
            this.errorMessages.push(response.error);
          }
        })
      } else {
        this.errorMessages.push("Trebuie sa adaugi minim 3 specificatii produsului nou adaugat!");
      }
    } else {
      console.log(this.addProductForm.value);
      this.errorMessages.push("Toate campurile sunt obligatorii!");
    }
  }
  onChange($event: any) {
    this.imageArray.push($event.file.file)
    this.addProductForm.patchValue({
      image: this.imageArray
    });
  }

  onDelete($event: any) {
    const index = this.imageArray.findIndex(i => i.lastModified === $event.file.file.lastModified && i.name === $event.file.file.name);
    this.imageArray.splice(index, 1);
    this.addProductForm.patchValue({
      image: this.imageArray
    });
  }

  resetForm() {
    this.addProductForm.reset();
    this.addProductForm.patchValue({
      category: 0
    });
    while((this.addProductForm.get('technicalDetailsJson') as FormArray).length > 0) {
      this.technicalDetailsJson.removeAt((this.addProductForm.get('technicalDetailsJson') as FormArray).length - 1);
    }
    while((this.addProductForm.get('partForCar') as FormArray).length > 0) {
      this.partForCar.removeAt((this.addProductForm.get('partForCar') as FormArray).length - 1);
    }
    this.markControlsUntouched();
  }

  public markControlsUntouched(): void {
    Object.keys(this.addProductForm.controls).forEach((key: string) => {
        const abstractControl = this.addProductForm.controls[key];
        abstractControl.setErrors(null);
    });
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
    this.addProductForm.get('partForCar')?.value.forEach((element: any) => {
      cars.push(element.engine);
    });
    return cars;
  }
}
