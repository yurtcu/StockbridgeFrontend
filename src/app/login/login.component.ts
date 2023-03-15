
//File location in login folder and file name login.component.ts
import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiResult } from "../api-result";
import { ApiService } from "../api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })
  
  public loginError:any = null;
  constructor(private apiService:ApiService, private router: Router) { }

  ngOnInit() {}

  onSubmit(){
    if(this.loginForm.valid){
      this.loginError = null;
      this.apiService.login(this.loginForm.value).subscribe((data) => {
        console.log(data);
        if(data.status === 200 && data.body?.status === 0){
          this.router.navigate(['/welcome']);
        }
        else{
          this.loginError = data.body?.error;
        }        
      },
      error => this.loginError = error);
    }
  }
}