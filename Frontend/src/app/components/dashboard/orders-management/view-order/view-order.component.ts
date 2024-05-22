import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { OrderInterface } from '../../../../models/order.model';
import { OrderService } from '../../../../services/order.service';
import { AdminService } from '../../services/admin.service';
import { UserInteface } from '../../../../models/user.model';
import { MemberViewInterface } from '../../models/admin.model';
import { ProductsInterface } from '../../models/products.model';
import { ProductsService } from '../../services/products.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.css'
})
export class ViewOrderComponent implements AfterViewInit {
  orderID: number = 0;
  order!: OrderInterface;
  user?: MemberViewInterface;
  products: ProductsInterface[] = []; 

  constructor(private titleService: Title, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, public userService: UserService, 
              private activatedRoute: ActivatedRoute, private orderService: OrderService, public adminService: AdminService, private productService: ProductsService,
              private toastService: ToastService) {
    this.titleService.setTitle("Vezi comanda - La Verucu' SRL");
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if(id) {
          this.orderID = parseInt(id, 10);
        }
      }
    });
  }

  ngOnInit(): void {
    this.initializeOrder();
    setTimeout(() => {
      this.initializeProductsList();
      this.initializeUser();
    }, 100);
  }


  initializeOrder() {
    this.activatedRoute.data.subscribe((response: any) => { 
      console.log(response);
      this.order = response.order;
    });
  }

  initializeProductsList() {
    this.order.orderDetails.forEach((item) => {
      this.productService.getProduct(item.productId).subscribe({
        next: (value) => {
          this.products.push(value);
        }
      })
    });
  }

  initializeUser() {
    this.adminService.getMember(this.order.userId).subscribe({
      next: (value) => {
        this.user = value;
      }
    });
  }

  markAsConfirm() {
    if(!this.order.isConfirmed) {
      this.orderService.markConfirm(this.orderID).subscribe({
        next: (value) => {
          console.log(value)
          this.toastService.show({title: "Comanda Marcata!", message: "Comanda a fost marcata cu succes!", classname:"text-success"});
          this.order.isConfirmed = true;
        }
      });
    } else {
      this.toastService.show({title: "Eroare!", message: "Acest produst a fost deja marcat!", classname:"text-danger"});
    }
  }

  getImage(folderName:string, imageID: string) {
    return 'http://localhost:5020/SiteUploads/ShopImages/' + folderName + "/" + folderName + "_" + imageID + ".png";
  }

  calculatePrice(numberOfProducts: number, price: number) {
    return numberOfProducts * price;
  }

  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.src = "/assets/js/index-page.js";
    this._renderer2.appendChild(this._document.body, script);
  }
}
