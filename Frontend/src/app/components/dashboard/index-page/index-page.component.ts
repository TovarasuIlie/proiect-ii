import { DOCUMENT, DatePipe } from '@angular/common';
import { Component, Inject, Renderer2} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../services/user.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.css',
  providers: [DatePipe]
})
export class IndexPageComponent {
  public chart1: any;
  public chart2: any;
  totalAccounts: number = 123;
  ordersInLastMonth: number = 2;
  deliveredOrders: number = 23;
  returnedOrders: number = 1;

  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, public userService: UserService, private datePipe: DatePipe) {
    this.titleService.setTitle("Dashboard - La Verucu' SRL");
  }

  ngOnInit(): void {
    this.createSellsAndProfitChart();
    this.createOrdersChart();
  }

  createSellsAndProfitChart(){
    let dates: string[] = [];
    for(let i = 0; i < 8; i++) {
      const now = new Date();
      let currentDateAndTime = this.datePipe.transform(now.setDate(now.getDate() + i), 'd.MM.YYYY');
      dates.push(currentDateAndTime || "");
    }
    this.chart1 = new Chart("SellsAndProfit", {
      type: 'bar', 
      data: {
        labels: dates , 
	       datasets: [
          {
            label: "Vanzari (buc)",
            data: ['467','576', '572', '79', '92',
								 '574', '573', '576'],
          },
          {
            label: "Profit (lei)",
            data: ['542', '542', '536', '327', '17',
									 '0.00', '538', '541'],
          }  
        ]
      },
    });
  }

  createOrdersChart(){
    this.chart2 = new Chart("Orders", {
      type: 'pie', 
      data: {
        labels: ["Livrate", "Retur"] , 
	       datasets: [
          {
            label: "Livrate",
            data: [Math.floor(Math.random() * ((999 - 100))) + 100, Math.floor(Math.random() * ((99 - 10))) - 1],
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }

  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.src = "/assets/js/index-page.js";
    this._renderer2.appendChild(this._document.body, script);
  }
}
