import { Injectable} from '@angular/core';
import { LoginUserInterface, UserInteface, RegisterUserInterface } from '../models/user.model';
import { Observable, ReplaySubject, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSource = new ReplaySubject<UserInteface | null>(1);
  user$ = this.userSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  refreshUser(jwt: string | null) {
    if(jwt === null) {
      this.userSource.next(null);
      return of(undefined);
    }

    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + jwt);

    return this.http.get<UserInteface>(environment.apiUrl + "/api/Account/refresh-user-token", {headers}).pipe(
      map((user: UserInteface) => {
        if(user) {
          this.setUser(user);
        }
      })
    );
  }

  addNewUser(registerUser: RegisterUserInterface): Observable<RegisterUserInterface>{
    return this.http.post<RegisterUserInterface>(environment.apiUrl + "/api/Account/register", registerUser);
  }

  loginUser(loginUser: LoginUserInterface) {
    return this.http.post<UserInteface>(environment.apiUrl + "/api/Account/login",  loginUser).pipe(
      map((user: UserInteface) => {
        if(user) {
          this.setUser(user);
        }
      })
    );
  }

  logOut() {
    localStorage.removeItem(environment.userKey);
    this.userSource.next(null);
    this.router.navigateByUrl('/');
  }
  

  getJWT() {
    const key = localStorage.getItem(environment.userKey);
    if(key) {
      const user: UserInteface = JSON.parse(key);
      return user.jwt;
    } else {
      return null;
    }
  }

  private setUser(user: UserInteface) {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userSource.next(user);
  }
}
