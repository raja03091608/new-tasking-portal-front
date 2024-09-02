import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {

  constructor() { }

  log(msg:any, data:any) {
    //console.log(msg,data);
  }

  warn(msg:any,data:any) {
    //console.warn(msg,data);
  }

  error(msg:any,data:any) {
    //console.error(msg,data);
  }

  info(msg){
    //console.info(msg);
  }
  
}

