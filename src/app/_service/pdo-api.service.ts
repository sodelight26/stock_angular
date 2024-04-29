
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})



export class ApiPdoService {
  searchProductIds(value: any) {
    throw new Error('Method not implemented.');
  }
  private params = new HttpParams();
  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }


  getdata(url: string,opt: any,tbl: any,param: any) {
    return this.http.post<any[]>(`${environment.apiUrlPHP}` + url,
      {
        "opt": opt,
        "tbl":tbl,
        "param":param
      });
  }

  pgetdata(params: any,linkapi: any) {
    return this.http.post<any[]>(`${environment.apiUrlPHP}` + linkapi,params);
  }

  getDataPage(url: string,otp:any,tbl:any,p:any, size:any, sort:any, param:any) {
    let page = 0;
    if (p) page = p;
    return this.http.post<any>(`${environment.apiUrlPHP}`+ url,
      {
        "opt": otp,
        "tbl": tbl,
        "page": page,
        "size": size,
        "sort": sort,
        "param": param
      });
  }


}
