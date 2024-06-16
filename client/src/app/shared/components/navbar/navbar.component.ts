import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  isLoggedIn = false;
  userId = localStorage.getItem('userId');
  isCollapsed = true;
  isAdmin = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.authService.isAdmin().subscribe((isAdmin: boolean) =>{
      this.isAdmin = isAdmin;
    });
    // this.authService.obsUserId().subscribe((userId: string | null) => {
    //   this.userId = userId;
    // })
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  // getUserId(): string | null {
  //   return this.authService.getUserId();
  // }
  // setUserId(): void {
  //   this.userId = this.getUserId();
  // }

  onDetailsClick(): void{
    this.isCollapsed = true;
    if(this.userId){
      this.router.navigate(['/customer-details', this.userId]);
    }
  }

  // logdetails(){
  //   console.log(this.userId);
  // }

}
