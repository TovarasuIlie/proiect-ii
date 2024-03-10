import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrlApi: string = "";

  constructor(private http: HttpClient) { }

  addNewUser(userRegister: User): Observable<User>{
    return this.http.post<User>(this.baseUrlApi + "/test", userRegister);
  }
}
