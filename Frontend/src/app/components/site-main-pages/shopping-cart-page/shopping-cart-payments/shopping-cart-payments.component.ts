import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShareDataService } from '../../../../services/share-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart-payments',
  templateUrl: './shopping-cart-payments.component.html',
  styleUrl: './shopping-cart-payments.component.css'
})
export class ShoppingCartPaymentsComponent {
  payment: FormGroup = new FormGroup([])
  constructor(private formBuilder: FormBuilder, private shareData: ShareDataService, private router: Router) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.payment = this.formBuilder.group({
      paymentType: ["visa-master-american", [Validators.required]]
    })
  }
  
  paymentMethod() {
    console.log(this.payment.value);
    sessionStorage.setItem("paymentMethod", this.payment.get('paymentType')?.value);
    this.router.navigateByUrl('/cosul-meu/checkout');
  }
}
