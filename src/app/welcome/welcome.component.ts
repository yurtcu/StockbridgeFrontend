import { Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  welcomeMessage?: string;

  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
      this.apiService.getGreeting().subscribe((data) => {
        console.log(data);
        if(data.status === 200 && data.body?.status === 0){
          this.welcomeMessage = data.body.data;
        }
        else{
          this.welcomeMessage = data.body?.error;
        }        
      },
      error => this.welcomeMessage = error);
  }
  
  logout(){
    this.apiService.logout();
  }
}
