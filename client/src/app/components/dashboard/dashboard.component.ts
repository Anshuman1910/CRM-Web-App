import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit{
  backgroundUrl = 'https://images.unsplash.com/photo-1521193089946-7aa29d1fe776?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  activities: any[] = [];
  // newActivity: any = {};
  userId: any;
  activityForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private authService: AuthService
  ){
    this.activityForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.getUserId();
    if(this.userId){
      this.loadActivities();
    }
  }
  getUserId(): string | null {
    return this.authService.getUserId();
  }

  loadActivities(): void {
    this.activityService.getActivities(this.userId).subscribe((activities: any[]) => {
      this.activities = activities.sort((a, b) => {
        if (a.status === 'completed' && b.status !== 'completed') {
          return 1;
        } else if (a.status !== 'completed' && b.status === 'completed') {
          return -1;
        } else {
          return 0;
        }
      });
    });
  }

  addActivity() {
    if (this.activityForm.invalid) {
      return;
    }

    const title = this.activityForm.value.title;
    const description = this.activityForm.value.description;

    this.activityService.addActivity(this.userId,title, description).subscribe(
      (response) => {
        console.log('Activity added successfully:', response);
        // Show success message
        Swal.fire('Success', 'Activity added successfully', 'success');
        // Reset form after successful submission
        this.activityForm.reset();
      },
      (error) => {
        console.error('Error adding activity:', error);
        // Show error message
        Swal.fire('Error', 'Failed to add activity', 'error');
      }
    );
  }

  markAsDone(activityId: string): void {
    this.activityService.updateActivity(activityId, 'completed').subscribe((updatedActivity) => {
      // Find the index of the updated activity
      const index = this.activities.findIndex(activity => activity._id === updatedActivity._id);

      if (index !== -1) {
        // Update the status in the array
        this.activities[index].status = updatedActivity.status;

        // Move the updated activity to the end of the array
        const [completedActivity] = this.activities.splice(index, 1);
        this.activities.push(completedActivity);
      }
    });
  }

  deleteActivity(activityId: string): void {
    this.activityService.deleteActivity(activityId).subscribe(() => {
      this.activities = this.activities.filter(activity => activity._id !== activityId);
    });
  }

  formatDate(date: string): string {
    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
    return formattedDate ? formattedDate : 'Invalid Date';
  }
}
