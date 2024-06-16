import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  backgroundUrl = 'https://images.unsplash.com/photo-1521193089946-7aa29d1fe776?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  form: any;
  emailRegex : string = "[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$";
  contactRegex : string = "[789][0-9]{9}"

  constructor(
    fb : FormBuilder,
    private router : Router,
    private authService: AuthService

  ){
    this.form = fb.group({
      name : ['',[
        Validators.required,

      ]],
      email : ['',[
        Validators.required,
        Validators.pattern(this.emailRegex)
      ]],
      password : ['',[
        Validators.required
      ]],
      confirmPassword : ['',[
        Validators.required
      ]],
      contact_no : ['',[
        Validators.required,
        Validators.pattern(this.contactRegex)
      ]]
    })

  }
  get Name(){
    return this.form.get('name');
  }
  get Email(){
    return this.form.get('email');
  }
  get Password(){
    return this.form.get('password');
  }
  get ConfirmPassword(){
    return this.form.get('confirmPassword');
  }
  get ContactNo(){
    return this.form.get('contact_no');
  }

  onSubmit(){

    if(this.form.value.password != this.form.value.confirmPassword){
      alert("Confirm password do not match")
    }
    else{
      const formData = new FormData();
      formData.append('name', this.form.value.name);
      formData.append('email', this.form.value.email);
      formData.append('password', this.form.value.password);
      formData.append('contact_no', this.form.value.contact_no);

      this.authService.register(formData).subscribe(
        response => {
          console.log("User registered successfully", response);
          // Handle success (e.g., show a success message, redirect to login page)
          Swal.fire("Registration successful", "You can now login", "success").then(() => {
            this.router.navigate(['/login']);
          });

        },
        error => {
          console.log("Registration failed", error);
        // Handle error based on status code
        if (error.status === 409) {
          Swal.fire("Registration failed", "User already exists", "error");
        } else {
          Swal.fire("Registration failed", "Please try again later", "error");
        }
        }
      );
    }
  }
}
