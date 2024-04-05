import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ProductsInterface } from '../../../dashboard/models/products.model';
import { ProductsService } from '../../../dashboard/services/products.service';

@Component({
  selector: 'app-tire-presentation-page',
  templateUrl: './tire-presentation-page.component.html',
  styleUrl: './tire-presentation-page.component.css'
})
export class TirePresentationPageComponent {
  productID: any = '';
  photoLinks: string[] = ['test', 'test', 'test', 'test'];
  tire: ProductsInterface = {
    id: 91733,
    title: "Rotalla Setula W Race S130 914372",
    description: "test",
    category: null,
    technicalDetailsJson: '[{"specificationTitle":"Latime","specificationValue":"155"},{"specificationTitle":"Inaltime","specificationValue":"70"},{"specificationTitle":"Tip","specificationValue":"R"},{"specificationTitle":"Diametru","specificationValue":"13"},{"specificationTitle":"Indice de capacitate de incarcare","specificationValue":"75"},{"specificationTitle":"Indice de viteza","specificationValue":"T"},{"specificationTitle":"Tip","specificationValue":"Auto"},{"specificationTitle":"Protectia jantei","specificationValue":"Nu"},{"specificationTitle":"Cauciucuri runflat","specificationValue":"Nu"},{"specificationTitle":"Niturile","specificationValue":"Nu"},{"specificationTitle":"Consolidat  reinforced","specificationValue":"Nu"},{"specificationTitle":"Caut caucicucuri C","specificationValue":"Nu"}]',
    quantity: 1,
    price: 12343.31
  }

  constructor(private title: Title, private activatedRoute: ActivatedRoute, private productService: ProductsService) {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const tireName = params.get('title')?.replaceAll('-', ' ');
        this.productID = params.get('id');
        if(tireName) {
          this.title.setTitle(tireName + "- La Vericu' SRL");
        }
      }
    })
  }
  ngOnInit(): void {
    this.initializeProduct();
  }

  initializeProduct() {
    this.productService.getProduct(this.productID).subscribe({
      next: (value) => {
        this.tire = value;
        this.tire.technicalDetailsJson = JSON.parse(value.technicalDetailsJson);
      }
    })
  }
}
