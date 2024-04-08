import { Component, OnInit } from '@angular/core';
import { ProductsInterface } from '../../../dashboard/models/products.model';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryInterface } from '../../../dashboard/models/category-interface';
import { ShareDataService } from '../../../../services/share-data.service';

@Component({
  selector: 'app-tires-category-list',
  templateUrl: './tires-category-list.component.html',
  styleUrl: './tires-category-list.component.css'
})
export class TiresCategoryListComponent implements OnInit {
  tires: ProductsInterface[] = [];
  currentCategory: CategoryInterface = {
    id: 0,
    name: ''
  }

  constructor(private title: Title, private activatedRoute: ActivatedRoute, private router: Router, private shareData: ShareDataService) {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const tireType = params.get('tireCategory');
        if(tireType) {
          this.title.setTitle("Anvelope " + tireType + "- La Vericu' SRL");
        }
      }
    });
    window.scrollTo();
  }

  ngOnInit(): void {
    this.initializeList();
    this.shareData.getData().subscribe((value) => {
        console.log(value.find((c: CategoryInterface) =>  c.name == 'Anvelope'));
    });
  }

  initializeList() {
    this.activatedRoute.data.subscribe((response: any) => { 
      response.productsList.map((tire: any) => {
        tire.technicalDetailsJson = JSON.parse(tire.technicalDetailsJson);
        this.tires.push(tire);
      })
    })
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
