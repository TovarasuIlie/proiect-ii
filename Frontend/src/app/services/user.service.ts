import { Injectable} from '@angular/core';
import { LoginUserInterface, UserInteface, RegisterUserInterface, ConfirmEmail, ResetPassword } from '../models/user.model';
import { Observable, ReplaySubject, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

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

    return this.http.get<UserInteface>(environment.apiUrl + "/api/Account/refresh-page", {headers}).pipe(
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

  confirmEmail(confirmEmail: ConfirmEmail) {
    return this.http.put<ConfirmEmail>(environment.apiUrl + "/api/Account/confirm-email", confirmEmail);
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

  sendResetLink(email: string) {
    return this.http.post(environment.apiUrl + "/api/Account/forgot-username-or-password/" + email, {})
  }

  resendEmailLink(email: string) {
    return this.http.post(environment.apiUrl + "/api/Account/resend-email-confirmation-link/" + email, {})
  }

  resetPassword(resetPassword: ResetPassword) {
    return this.http.put(environment.apiUrl + "/api/Account/reset-password", resetPassword);
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

  getID() {
    const key = localStorage.getItem(environment.userKey);
    if(key) {
      const user: UserInteface = JSON.parse(key);
      const decodedToken: any = jwtDecode(user.jwt);
      return decodedToken.nameid;
    } else {
      return null;
    }
  }

    getEmail() {
      const key = localStorage.getItem(environment.userKey);
      if(key) {
        const user: UserInteface = JSON.parse(key);
        const decodedToken: any = jwtDecode(user.jwt);
        return decodedToken.email;
      } else {
        return null;
      }
    } 
}
