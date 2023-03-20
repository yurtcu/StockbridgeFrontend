import { Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { CookieService } from 'ngx-cookie-service';
import { retry } from 'rxjs/operators';


export interface mySocketMessage {
  MessageType: SocketMessageType;
  TimeStamp: Date;
}

enum SocketMessageType {
  Ping = 0, LogOff = 1
};

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  welcomeMessage?: string;
  onlineStatus?: boolean;

  private myWebSocket?: WebSocketSubject<mySocketMessage>;
  private retryCount: number = 0;
  private maxRetryCount: number = 3;
  private wsUrl: string = 'wss://socketsbay.com/wss/v2/1/demo/'; // 3rd party socket server for testing...
  //private wsUrl: string = 'ws://66.70.229.82:8181/?' + this.cookieService.get('currentUser');

  constructor(private apiService:ApiService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.apiService.getGreeting().subscribe((data) => {
      if(data.status === 200 && data.body?.status === 0){
        this.welcomeMessage = data.body.data;
      }
      else{
        this.welcomeMessage = data.body?.error;
      }        
    },
    error => this.welcomeMessage = error);

    this.createSocket();
  }
  
  private createSocket(): void{
    if (this.retryCount > this.maxRetryCount) {
      this.myWebSocket = undefined;
      this.onlineStatus = false;
      return;
    }

    this.retryCount++;

    this.myWebSocket = webSocket<mySocketMessage>({
      url: this.wsUrl,
      openObserver: {
        next: () => {
          this.onlineStatus = true;
          this.retryCount = 0;
        }
      },
      closeObserver: {
        next: () => {
          console.log("Websocket connection closed!");
          this.onlineStatus = undefined;
          setTimeout(() => this.createSocket(), 1000); // Try to connect again.
        }
      }
    });

    this.myWebSocket.asObservable().subscribe(dataFromServer => {
      this.onlineStatus = true;
      console.log(dataFromServer);
      switch(dataFromServer.MessageType) {
        case SocketMessageType.Ping:
          // Answer incoming ping message with sending a ping message. I do not know if it is necessary or not, just an idea.
          this.myWebSocket?.next({ 
            "MessageType": SocketMessageType.Ping,
            "TimeStamp": new Date()
          });
          break;
        case SocketMessageType.LogOff:
          this.myWebSocket?.complete();
          this.logout();
      }
    }, 
    err => {
      console.log(err);
      this.onlineStatus = undefined;
      this.myWebSocket.complete();
      setTimeout(() => this.createSocket(), 1000); // Try to connect again.
    });
  }

  logout(){
    this.retryCount = this.maxRetryCount + 1; // To stop retry creating socket.
    this.myWebSocket.complete();
    this.apiService.logout();
  }
}
