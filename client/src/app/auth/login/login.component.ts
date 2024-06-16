import { Component, Output, EventEmitter } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

import { response } from 'express';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent{
  @Output() loginSuccess = new EventEmitter<void>();
  backgroundUrl = 'https://images.unsplash.com/photo-1521193089946-7aa29d1fe776?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  form: any;
  emailRegex : string = "[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$";

  constructor(
    fb : FormBuilder,
    private router : Router,
    private authService: AuthService
  ){
    this.form = fb.group({
      email : ['',[
        Validators.required,
        Validators.pattern(this.emailRegex)
      ]],
      password : ['',[Validators.required]]
    })
  }

  get Email(){
    return this.form.get('email')
  }

  get Password(){
    return this.form.get('password')
  }
  onSubmit(){

  const formData = new FormData();
  formData.append('email', this.form.value.email);
  formData.append('password', this.form.value.password);

  this.authService.login(formData).subscribe(
    response => {
      const userId = this.authService.getUserId();
      if (userId) {
        console.log("isAdmin: ", this.authService.getIsAdmin());
        
        if(this.authService.getIsAdmin() === true){
          this.router.navigate(['/customer-list']);
        } else{
          this.router.navigate([`/dashboard/${userId}`]);
        }
      }
    },
    error => {
      Swal.fire('Login Failed', 'Invalid credentials', 'error');
    }
  );
  }
}
