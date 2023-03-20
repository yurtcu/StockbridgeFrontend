  import { Injectable } from '@angular/core';
  import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
  import { CookieService } from 'ngx-cookie-service';
  import { Observable, throwError, BehaviorSubject } from 'rxjs';
  import { catchError, map, tap } from 'rxjs/operators';
  import { Router } from '@angular/router';

  import { ApiResult } from "./api-result";

  @Injectable({
    providedIn: 'root'
  })
  export class ApiService {
    loginStatus = new BehaviorSubject<boolean>(this.hasToken());

    constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) { }
    login(formData: any): Observable<HttpResponse<ApiResult>> {
      return this.http.post<ApiResult>("/api/Authorize", formData, { observe: 'response' }).pipe(
        tap((resp: HttpResponse<ApiResult>) => {
          if (resp.body?.data) {
            this.cookieService.set("currentUser", (String)(resp.body.data.token));
            this.loginStatus.next(true);
          }
          return resp;
        }),
        catchError(this.handleError));
    }
    
    private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        console.error('An error occurred:', error.error.message);
      } 
      else {
        console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
      }
      return throwError('Error occured; please try again later.');
    };

    logout() {
      this.loginStatus.next(false);

      this.cookieService.deleteAll();
      this.router.navigate(['/login']);
    }

    getGreeting(): Observable<HttpResponse<ApiResult>> {
      return this.http.get<ApiResult>("/api/GetGreeting", { observe: 'response', headers: { 'x-user-token': this.cookieService.get("currentUser") } }).pipe(
        tap((resp: HttpResponse<ApiResult>) => {
          return resp;
        }),
        catchError(this.handleError));
    }

    private hasToken(): boolean {
  	  return this.cookieService.check('currentUser');
    }
  }