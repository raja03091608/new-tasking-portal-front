import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { userDetail } from '../../environments/userDetail';
import { HttpHeaders ,HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router} from '@angular/router';
import { NotificationService } from "../service/notification.service";
import * as CryptoJS from 'crypto-js';
import { language } from "../../environments/language";
import { Base64 } from 'js-base64';
//import * as $ from 'jquery';

declare const $: any;
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public token='';
  public previlleges:any;
  appLogo=localStorage.getItem('APPLOGO')?localStorage.getItem('APPLOGO'):'assets/meadia/logos/logo.png';
  userid:any;
  public tmsToken='';
  private userLoggedIn = new Subject<boolean>();
  constructor(private http : HttpClient, private router : Router, private notification : NotificationService) {
    let userDetails=localStorage.getItem('userDetail');
    this.token=localStorage.getItem('access-token');
    this.userid=this.decryptData(localStorage.getItem('token-detail'));
    if(localStorage.getItem('tmsToken'))
    {
      let tmsTokenDet=this.decryptData(localStorage.getItem('tmsToken'));
      this.tmsToken=tmsTokenDet.token;
    }
    else
      this.tmsToken='';
    if(userDetails)
    {
      let user=this.decryptData(userDetails);
      //userDetail.email=user.email;
      userDetail.loginname = user.loginname;
      userDetail.password=user.password;
    }

  }
  getToken(loginname:any,password:any): Observable<any>
  {
    this.userid=this.decryptData(localStorage.getItem('token-detail'));
    return new Observable((observer)=>{
      this.http.post(environment.API_URL+'api/auth/token',{loginname: loginname,password:password}).subscribe((res)=>{
        localStorage.setItem('user_id', this.userid );
        let data = res
        this.saveLocalData(data)
        let response=JSON.parse(JSON.stringify(res));
        let finalRes={};
        if(response.access)
        {
          finalRes={status:'success',message:'Credentials are matched',access:response.access,refresh:response.refresh}
          localStorage.setItem('access-token',response.access);
          this.token=response.access;
          finalRes={
            ...finalRes,
            ...response
          };

          //   this.getPrivileges(finalRes.role_id);
          // // console.log'finalres',finalRes.role_id);
        }
        if(response.status)
        {
          if(response.status==2)
          {
            finalRes=response;
          }
        }
        observer.next(finalRes);
      },(error)=>{
        let finalRes={status:'error',message:'Incorrect username/password'};
        observer.next(finalRes);
        // // console.logerror);
      });
    });

  }
  saveLocalData(data:any) {
        localStorage.setItem('sponsoring_directorate', data.user_group[0].name );

  }
  getAPI(url:any) : Observable<any>
  {
    this.userid=this.decryptData(localStorage.getItem('token-detail'));
    let tmsHeader = {};
    if(this.tmsToken!='')
    {
      tmsHeader={'X-Api-Key':this.tmsToken};
    }
    return new Observable((observer)=>{
      let headers = {'Authorization':`Bearer `+ this.token,'timeout':'6000','authorized-role':(this.userid.role_code?this.userid.role_code:''),'authorized-by':(this.userid.role_id?(this.userid.role_id).toString():'')};
      headers = {
        ...headers,
        ...tmsHeader
      }
      let httpOptions = {
        headers : new HttpHeaders(headers)
      };
      this.http.get(url,httpOptions).subscribe((res)=>{
        observer.next(res);
      },(error)=>{
        if(error.status==401)
        {
          this.getToken(userDetail.loginname,userDetail.password).subscribe((res)=>{
            this.getAPI(url).subscribe((res)=>{
              observer.next(res);
            });
          });
        }
        else
          observer.next(error);
      });
    });
  }
  postAPI(url:any, data:any,headerOptions={}) : Observable<any>
  {
    this.userid=this.decryptData(localStorage.getItem('token-detail'));
    let tmsHeader = {};
    if(this.tmsToken!='')
    {
      tmsHeader={'X-Api-Key':this.tmsToken};
    }
    return new Observable((observer)=>{

      let headers = {'Authorization':`Bearer `+ this.token,'timeout':'6000','authorized-role':(this.userid.role_code?this.userid.role_code:''),'authorized-by':(this.userid.role_id?(this.userid.role_id).toString():'')};
      headers = {
        ...headers,
        ...headerOptions,
        ...tmsHeader
      }
      let httpOptions = {
        headers : new HttpHeaders(headers)
      };

      this.http.post(url,data,httpOptions).subscribe((res)=>{
        observer.next(res);
      },(error)=>{
        if(error.status==401)
        {
          this.getToken(userDetail.loginname,userDetail.password).subscribe((res)=>{
            this.postAPI(url,data,headerOptions).subscribe((res)=>{
              observer.next(res);
            });
          });
        }
        else
          observer.next(error);
      });
    });
  }


  putAPI(url: any, data: any, headerOptions = {}): Observable<any> {
    this.userid = this.decryptData(localStorage.getItem('token-detail'));
    let tmsHeader = {};
    if (this.tmsToken != '') {
      tmsHeader = { 'X-Api-Key': this.tmsToken };
    }
    return new Observable((observer) => {
      let headers = {
        'Authorization': `Bearer ` + this.token,
        'timeout': '6000',
        'authorized-role': (this.userid.role_code ? this.userid.role_code : ''),
        'authorized-by': (this.userid.role_id ? (this.userid.role_id).toString() : '')
      };
      headers = {
        ...headers,
        ...headerOptions,
        ...tmsHeader
      };
      let httpOptions = {
        headers: new HttpHeaders(headers)
      };
      this.http.put(url, data, httpOptions).subscribe((res) => {
        observer.next(res);
      }, (error) => {
        if (error.status == 401) {
          this.getToken(userDetail.loginname, userDetail.password).subscribe((res) => {
            this.putAPI(url, data, headerOptions).subscribe((res) => {
              observer.next(res);
            });
          });
        } else {
          observer.next(error);
        }
      });
    });
  }

  deleteAPI(url: any, headerOptions = {}): Observable<any> {
    this.userid = this.decryptData(localStorage.getItem('token-detail'));
    let tmsHeader = {};
    if (this.tmsToken != '') {
      tmsHeader = { 'X-Api-Key': this.tmsToken };
    }
    return new Observable((observer) => {
      let headers = {
        'Authorization': `Bearer ` + this.token,
        'timeout': '6000',
        'authorized-role': (this.userid.role_code ? this.userid.role_code : ''),
        'authorized-by': (this.userid.role_id ? (this.userid.role_id).toString() : '')
      };
      headers = {
        ...headers,
        ...headerOptions,
        ...tmsHeader
      };
      let httpOptions = {
        headers: new HttpHeaders(headers)
      };
      this.http.delete(url, httpOptions).subscribe((res) => {
        observer.next(res);
      }, (error) => {
        if (error.status == 401) {
          this.getToken(userDetail.loginname, userDetail.password).subscribe((res) => {
            this.deleteAPI(url, headerOptions).subscribe((res) => {
              observer.next(res);
            });
          });
        } else {
          observer.next(error);
        }
      });
    });
  }
  getAccessJson(){
    let data = localStorage.getItem('token-detail');
    let access = this.decryptData(data);
    let modules = JSON.parse(access.permissions);

    return modules;
  }
getPageAction()
  {
    let data = localStorage.getItem('token-detail');
    if(data)
    {
      let access = this.decryptData(data);
      let modules = JSON.parse(access.permissions);


      let components = modules.map(value => value.components);
      let mergedComponents = [].concat.apply([], components);

      let attributes = mergedComponents.map(value => value.attributes);
      let mergedAttributes = [].concat.apply([], attributes);



      let currentPath=this.router.url;
      currentPath=currentPath.substring(1);

      let currentPageActionAttr = mergedAttributes.map(value => value.url==currentPath?value.action:'');
      let currentPageAction = mergedComponents.map(value => value.url==currentPath?value.action:'');

      currentPageAction=currentPageAction.concat(currentPageActionAttr);

      var filtered = currentPageAction.filter(function (el) {
        return el != '';
      });

      // // console.log'filtered',filtered);
      let finalActions=filtered.length>0?filtered[0]:'';
      if(finalActions!='')
      {
        let filterStatus = finalActions.map(value => value.status==true?value:'');
        var filteredStatus = filterStatus.filter(function (el) {
          return el != '';
        });
        return filteredStatus;
      }
      else
        return '';
    }

  }



  secugenErrorString(ErrorCode) {
        var Description;
        switch (ErrorCode) {
            // 0 - 999 - Comes from SgFplib.h
            // 1,000 - 9,999 - SGIBioSrv errors
            // 10,000 - 99,999 license errors
            case 51:
                Description = "System file load failure";
                break;
            case 52:
                Description = "Sensor chip initialization failed";
                break;
            case 53:
                Description = "Device not found";
                break;
            case 54:
                Description = "Fingerprint image capture timeout";
                break;
            case 55:
                Description = "No device available";
                break;
            case 56:
                Description = "Driver load failed";
                break;
            case 57:
                Description = "Wrong Image";
                break;
            case 58:
                Description = "Lack of bandwidth";
                break;
            case 59:
                Description = "Device Busy";
                break;
            case 60:
                Description = "Cannot get serial number of the device";
                break;
            case 61:
                Description = "Unsupported device";
                break;
            case 63:
                Description = "SgiBioSrv didn't start; Try image capture again";
                break;
            default:
                Description = "Unknown error code or Update code to reflect latest result";
                break;
        }
        return Description;
  }

  encryptData(data) {

    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), environment.CRYPTO_KEY).toString();
    } catch (e) {
      // // console.loge);
    }
  }

  decryptData(data) {

    try {
      const bytes = CryptoJS.AES.decrypt(data, environment.CRYPTO_KEY);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      // // console.loge);
    }
  }

  loggedIn() {
     return !!localStorage.getItem('userDetail');
   }

  setUserLoggedIn(userLoggedIn: boolean) {
    this.userLoggedIn.next(userLoggedIn);
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }


  applicationLogoutLog()
  {
    this.userid=this.decryptData(localStorage.getItem('token-detail'));
    //// console.log'this.userid',this.userid);
    this.postAPI(environment.API_URL + "api/auth/logout",{user_id:this.userid.user_id}).subscribe((res)=>{
      this.notification.displayMessage(res.message);
      localStorage.removeItem('userDetail');
      localStorage.removeItem('token-detail');
      localStorage.removeItem('user_id');
      this.router.navigateByUrl(localStorage.getItem('LOGINPAGE')?localStorage.getItem('LOGINPAGE'):'/authenticate/login');
    });
  }
  displayLoading(show=true)
  {
    if(show)
    {
      $('body').append(`<div class="body-load">
         <div class="loader-icon">
          <div class="loader"><img src="`+this.appLogo+`"></div>
         </div>
      </div>`);
    }
    else
    {
      $('.body-load').remove();
    }
  }

  getConfiguration(code='')
  {
    if(this.userid)
    {
      if(this.userid.configuration)
      {
        let config = (this.userid.configuration).filter(config=>{return config.code==code});
        return config[0].value;
      }
    }
    return '';
  }

  encrypt(str, secret) {
      str = Math.random().toString(36).substring(2, 10) + str;
      var _strkey = Base64.decode(secret);
      _strkey.split(",");
      var text = CryptoJS.enc.Utf8.parse(str);
      var Key = CryptoJS.enc.Base64.parse(_strkey.split(",")[1]); //secret key
      var IV = CryptoJS.enc.Base64.parse(_strkey.split(",")[0]); //16 digit
      var encryptedText = CryptoJS.AES.encrypt(text, Key, { keySize: 128 / 8, iv: IV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      var b64 = encryptedText.toString();
      var e64 = CryptoJS.enc.Base64.parse(b64);
      var eHex = e64.toLocaleString(CryptoJS.enc.Hex);
      return eHex.toUpperCase();
  }

  decrypt(str, secret) {
      try {
          var _strkey = Base64.decode(secret);
          var reb64 = CryptoJS.enc.Hex.parse(str);
          var text = reb64.toString(CryptoJS.enc.Base64);
          var Key = CryptoJS.enc.Base64.parse(_strkey.split(",")[1]); //secret key
          var IV = CryptoJS.enc.Base64.parse(_strkey.split(",")[0]); //16 digit
          var decryptedText = CryptoJS.AES.decrypt(text, Key, { keySize: 128 / 8, iv: IV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
          return decryptedText.toString(CryptoJS.enc.Utf8); //binascii.unhexlify(decryptedText)
      } catch (e) {
          // // console.log"Error", e)
      }
  }


}


