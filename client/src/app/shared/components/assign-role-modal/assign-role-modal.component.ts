import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-assign-role-modal',
  templateUrl: './assign-role-modal.component.html',
  styleUrl: './assign-role-modal.component.css'
})
export class AssignRoleModalComponent implements OnInit{
  role : string = '';
  userId: any;
  userName: string = '';

  constructor(
    public dialogRef: MatDialogRef<AssignRoleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.userId = this.data.userId;
    this.fetchUserName();
  }

  fetchUserName(): void {
    this.customerService.getUserById(this.userId).subscribe(
      (user: any) => {
        this.userName = user.name;
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  assignRole(): void {
    /// Call the service method to update the user's role in the database
    // Pass the userId and role entered by the admin as parameters
    this.customerService.updateUserRole(this.userId, this.role)
    .subscribe(
      (response) => {
        console.log('User role updated successfully:', response);
        // Close the dialog after successfully updating the role
        this.dialogRef.close();
      },
      (error) => {
        console.error('Error updating user role:', error);
        // Handle error, if any
      }
    );
  }
}
