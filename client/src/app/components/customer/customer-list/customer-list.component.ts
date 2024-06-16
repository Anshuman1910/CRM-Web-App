import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AssignRoleModalComponent } from '../../../shared/components/assign-role-modal/assign-role-modal.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {
  users: any[] = [];

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.customerService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  viewUserDetails(userId: string): void {
    this.router.navigate(['/customer-details', userId]);
  }

  deleteUser(userId: string): void {
    this.customerService.deleteUser(userId).subscribe(
      () => {
        this.users = this.users.filter(user => user._id !== userId);
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  openAssignRoleModal(userId: string): void {
    // Open the AssignRoleModalComponent as a dialog
    const dialogRef = this.dialog.open(AssignRoleModalComponent, {
      width: '400px',
      data: { userId: userId } // Pass the userId to the modal
    });

    // Subscribe to the afterClosed event to handle modal close
    dialogRef.afterClosed().subscribe(result => {
      // Handle any logic after the modal is closed, if needed
      // For example, you can reload the customers list after assigning the role
      if (result) {
        this.loadUsers(); // Reload the customers list
      }
    });
  }
}
