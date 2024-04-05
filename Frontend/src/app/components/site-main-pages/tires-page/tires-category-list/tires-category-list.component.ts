import { AfterViewChecked, AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ProductsInterface } from '../../../dashboard/models/products.model';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../dashboard/services/products.service';
import { CategoryInterface } from '../../../dashboard/models/category-interface';
import { HeaderComponent } from '../../../shared/header/header.component';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-tires-category-list',
  templateUrl: './tires-category-list.component.html',
  styleUrl: './tires-category-list.component.css'
})
export class TiresCategoryListComponent implements OnInit {
  tires: ProductsInterface[] = [];
  @ViewChild(HeaderComponent) child: any;
  currentCategory: CategoryInterface = {
    id: 0,
    name: ''
  }

  constructor(private title: Title, private activatedRoute: ActivatedRoute, private productService: ProductsService) {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const tireType = params.get('tireCategory');
        if(tireType) {
          this.title.setTitle("Anvelope " + tireType + "- La Vericu' SRL");
        }
      }
    })
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.currentCategory = this.child.categories.find((c: CategoryInterface) => c.name = "Anvelope");
      this.initializeList();
    }, 50);
  }

  initializeList() {
    this.productService.getProducts().subscribe({
      next: (value) => {
        value.map((tire) => {
          tire.technicalDetailsJson = JSON.parse(tire.technicalDetailsJson);
          this.tires.push(tire);
        })
      }
    });
  }

  sliceJSONArray(object: any[], from: number, to: number) {
    const returnedObj: any[] = [];
    if(object.length < to) {
      to = object.length;
    }
    for(let i = from; i < to; i++) {
      returnedObj.push(object[i]);
    }
    return returnedObj;
  }
}
