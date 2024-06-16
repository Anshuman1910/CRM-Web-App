import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { OnInit } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ActivityService implements OnInit{

  private apiUrl = 'http://localhost:5000/api/activities';

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {

  }

  // Get all activities for a user
  getActivities(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }

  // Add a new activity
  addActivity(userId: string, title: string, description: string): Observable<any> {
    // const userId = this.authService.getUserId(); // Get userId from AuthService
    const formData = new FormData();
    if (userId) { // Check if userId is not null
      formData.append('userId', userId); // Pass userId to the backend
    }
    formData.append('title', title);
    formData.append('description', description);

    return this.http.post<any>(`${this.apiUrl}/add`, formData);
  }

  // Update an activity
  updateActivity(id: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, { status });
  }

  // Delete an activity
  deleteActivity(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
}
