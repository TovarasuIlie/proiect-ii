import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderDetailInterface, OrderInterface } from '../models/order.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  newOrder(userId: string, orderDetails: OrderDetailInterface[], orderPrice: number) {
    const headers = new HttpHeaders().append("Content-Disposition", 'multipart/form-data')
    let formData = new FormData();
    formData.append("userId", userId);
    for(let i = 0; i < orderDetails.length; i++) {
      formData.append("orderDetails[" + i + "].productId", orderDetails[i].productId.toString());
      formData.append("orderDetails[" + i + "].quantity", orderDetails[i].quantity.toString());
    }
    formData.append("orderPrice", orderPrice.toString());
    return this.http.post(environment.apiUrl + "/api/Order/create-order", formData, {headers});
  }

  getAdminOrders() {
    return this.http.get<OrderInterface[]>(environment.apiUrl + "/api/Order/all-orders");
  }

  getOrder(id: number) {
    return this.http.get<OrderInterface>(environment.apiUrl + "/api/Order/get-order-by-id/" + id);
  }

  getOrders() {
    return this.http.get<OrderInterface[]>(environment.apiUrl + "/api/Order/get-orders");
  }

  markConfirm(id: number) {
    return this.http.put(environment.apiUrl + "/api/Order/confirm-order/" + id, {});
  }
}
