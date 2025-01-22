
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthService implements HttpInterceptor {

  
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const nonce = btoa(crypto.randomUUID());
    

    const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}' ;
    img-src 'self' blob: data:;
    font-src 'self';
    media-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'

  `
 
  const userAgent = navigator.userAgent || 'unknown-agent'; 
  if (userAgent === 'bad-agent') {
      throw new Error('Blocked bad User-Agent');
    }

  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()
    
    const clonedRequest = req.clone({
      // setHeaders: {
      //   'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' ; img-src 'self'; frame-ancestors 'none'",
      //   'X-Frame-Options': 'DENY',
      //   'X-Content-Type-Options': 'nosniff',
      //   'X-XSS-Protection': '1; mode=block'
      // },
      setHeaders:{
        'Content-Security-Policy': contentSecurityPolicyHeaderValue,
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'User-Agent': userAgent
      }
    });

    // Handle the request
    return next.handle(clonedRequest).pipe(
      // Handle errors globally
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle unauthorized access, maybe redirect to login page
          console.error('Unauthorized request - redirecting to login');
        }
        return throwError(error); // Re-throw the error so it can be handled elsewhere
      })
    );
  }
}
