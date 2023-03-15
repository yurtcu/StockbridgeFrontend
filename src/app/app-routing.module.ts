import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component'; 
import { WelcomeComponent } from './welcome/welcome.component';
//import { AuthGuard } from "./auth.guard";

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent}
  //{ path: 'dashboard', component: WelcomeComponent,canActivate: [AuthGuard]}
  //{ path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule,RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
