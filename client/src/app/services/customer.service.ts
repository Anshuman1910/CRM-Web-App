import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'https://crm-app-va2d.onrender.com/api';

  constructor(private http: HttpClient) { }

  // private getHeaders(): HttpHeaders {
  //   const token = localStorage.getItem('token');
  //   console.log(token);
  //   return new HttpHeaders().set('Authorization', token ? token : '');
  // }

  getUsers(): Observable<any> {
    // const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/users`);
  }

  // Fetch details of a single user
  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  // Update user role
  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, { role });
  }

  // Delete a user
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }
}
