import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tires-page',
  templateUrl: './tires-page.component.html',
  styleUrl: './tires-page.component.css'
})
export class TiresPageComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle("Anvelope - La Vericu SRL");
  }
}
