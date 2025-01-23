import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from "../service/api.service";

@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard implements CanActivate {
  constructor(private api : ApiService, private router: Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.api.loggedIn()) {
      let tokenDetail=this.api.decryptData(localStorage.getItem('token-detail'));
      if(tokenDetail.permissions)
      {
        let modules=JSON.parse(tokenDetail.permissions);
        setTimeout(()=>{
          //this.urlRestriction(modules);
        },300);

      }
      return true;
    } else {
      const url:any =localStorage.getItem('LOGINPAGE')?localStorage.getItem('LOGINPAGE'):'/authenticate/login';
      this.router.navigateByUrl(url);
      return false;
    }

  }

  // urlRestriction(modules)
  // {

  //   let components = modules.map(value => value.components);
  //   let mergedComponents = [].concat.apply([], components);

  //   let attributes = mergedComponents.map(value => value.attributes);
  //   let mergedAttributes = [].concat.apply([], attributes);

  //   let componentURLs = mergedComponents.map(value => value.status==true?value.url:'');
  //   let attributeURLs = mergedAttributes.map(value => value.status==true?value.url:'');
  //   let moduleURLs = modules.map(value => value.status==true?value.url:'');

  //   let mergedURLs = componentURLs.concat(attributeURLs);
  //   mergedURLs=mergedURLs.concat(moduleURLs);
  //   mergedURLs = mergedURLs.filter(function (el) {
  //     return el != '';
  //   });

  //   let currentPath=location.hash;
  //   currentPath=currentPath.substring(2);
  //   /*// console.log'currentPath',currentPath);
  //   // console.log'mergedURLs',mergedURLs);*/
  //   if(mergedURLs.indexOf(currentPath)===-1)
  //   {
  //     this.router.navigateByUrl('/error/403');
  //   }

 urlRestriction(modules:any)
{
  let tokenDetail=this.api.decryptData(localStorage.getItem('token-detail'));

  let components = modules.map((value:any) => value.components);
  let mergedComponents = [].concat.apply([], components);

  let attributes = mergedComponents.map((value:any) => value.attributes);
  let mergedAttributes = [].concat.apply([], attributes);

  let componentURLs = mergedComponents.map((value:any) => value.status==true?value.url:'');
  let attributeURLs = mergedAttributes.map((value:any) => value.status==true?value.url:'');
  let moduleURLs = modules.map((value:any) => value.status==true?value.url:'');

  let mergedURLs = componentURLs.concat(attributeURLs);
  mergedURLs=mergedURLs.concat(moduleURLs);
  mergedURLs = mergedURLs.filter(function (el) {
    return el != '';
  });

  let currentPath=location.hash;
  currentPath=currentPath.substring(2);
  /*// console.log'currentPath',currentPath);
  // console.log'mergedURLs',mergedURLs);*/
  mergedURLs.push('authenticate/biometrics-log');
  mergedURLs.push('authenticate/biometrics-verify');
  if(mergedURLs.indexOf(currentPath)===-1 && tokenDetail.role_code=='admin')
  {
    this.router.navigateByUrl('/error/403');
  }
}


}
