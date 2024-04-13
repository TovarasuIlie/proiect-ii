import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shopping-cart-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class ShoppingCartHeaderComponent implements OnInit {
  stage: number = 1;

  constructor(private activeRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activeRoute.url.subscribe({
      next: (value) => {
        if(value.length === 0) {
          this.stage = 1;
        } else {
          if(value[0].path.includes('adresa-de-livrare')) {
            this.stage = 2;
          }
          if(value[0].path.includes('plata')) {
            this.stage = 3;
          }
          if(value[0].path.includes('checkout')) {
            this.stage = 4;
          }
        }
      },
    })
  }
}
