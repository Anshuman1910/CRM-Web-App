import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './shared/components/home/home.component';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { CustomerDetailComponent } from './components/customer/customer-detail/customer-detail.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "login", component: LoginComponent},
  {path : "register", component: RegisterComponent},
  {path: "dashboard/:userId", component: DashboardComponent, canActivate: [AuthGuard]},
  {path: "customer-list", component: CustomerListComponent , canActivate: [AuthGuard]},
  { path: 'customer-details/:userId', component: CustomerDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
