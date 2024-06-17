import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
interface LoginResponse {
  token: string,
  isAdmin: boolean
  // You can add other properties if needed
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://crm-app-va2d.onrender.com';
  private loggedInSubject: BehaviorSubject<boolean>;
  private adminSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    this.loggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
    this.adminSubject = new BehaviorSubject<boolean>(this.getIsAdmin()); // Use getIsAdmin() instead of isAdminAuth()
  }

  login(formData: FormData): Observable<any> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, formData).pipe(
      switchMap(response => {
        const token = response && response.token;
        if (token) {
          this.storeToken(token);
          this.loggedInSubject.next(true);
          this.setIsAdmin(response.isAdmin);
          return this.verifyToken(token).pipe(
            map(decoded => ({ response, userId: decoded.userId }))
          );
        } else {
          console.log("Invalid token: ");
          return of({ response, userId: null });
        }
      }),
      map(({ response, userId }) => {
        if (userId) {
          this.setUserId(userId);
        }
        return response;
      })
    );
  }

  getIsAdmin(): boolean {
    const isAdminValue = localStorage.getItem('isAdmin');
    return isAdminValue ? JSON.parse(isAdminValue) : false;
  }

  setIsAdmin(isAdmin: boolean): void {
    localStorage.setItem('isAdmin', isAdmin.toString());
    this.adminSubject.next(isAdmin);
  }

  register(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, formData);
  }

  logout(): void {
    this.removeToken();
    this.loggedInSubject.next(false);
    this.adminSubject.next(false); // Reset admin status on logout
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  isAdmin(): Observable<boolean> {
    return this.adminSubject.asObservable();
  }

  private storeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private removeToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
  }

  private isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  private verifyToken(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/verify`, {}, {
      headers: { 'x-auth-token': token }
    }).pipe(
      map(response => response)
    );
  }

  setUserId(userId: string): void {
    localStorage.setItem('userId', userId);
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
}
