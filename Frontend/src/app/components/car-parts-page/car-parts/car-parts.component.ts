import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-car-parts',
  templateUrl: './car-parts.component.html',
  styleUrl: './car-parts.component.css'
})
export class CarPartsComponent {
  carMake: string = "";

  constructor(private titleService: Title, private router: ActivatedRoute) {
    this.titleService.setTitle("Piese auto - La Vericu SRL");
  }

  ngOnInit() {
    this.router.paramMap.subscribe({
      next: (params) => {
        const carMake = params.get('carMake');
        if(carMake) {
          this.carMake = carMake;
        }
      },
    })
  }
}
