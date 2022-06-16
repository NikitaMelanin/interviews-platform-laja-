import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from "rxjs/operators";

export interface IUserCredentials {
  token: string;
  isAuthorized: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<IUserCredentials | null>;
  public currentUser: Observable<IUserCredentials | null>

  constructor(private _http: HttpClient) {
    const token = localStorage.getItem('auth') as string;
    this.currentUserSubject = new BehaviorSubject<IUserCredentials | null>(token ? {token, isAuthorized: true} : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUserCredentials | null {
    return this.currentUserSubject.value;
  }

  public logIn(login: string, password: string): Observable<IUserCredentials> {
    const query = new URLSearchParams({
      login,
      password
    });
    return this._http.get('https://localhost:44423/api/account/login?' + query.toString(), {}).pipe(map(token => {
      const user: IUserCredentials = {
        token: token as string,
        isAuthorized: true,
      };
      localStorage.setItem('auth', token as string);
      this.currentUserSubject.next(user);
      this._http.get('https://localhost:44423/api/account/roles', {}).subscribe((x: any) => {
        localStorage.setItem('roles', x)
      })
      return user;
    }))
  }

  public logOut() {
    localStorage.removeItem("auth");
    this.currentUserSubject.next(null);
  }
}
