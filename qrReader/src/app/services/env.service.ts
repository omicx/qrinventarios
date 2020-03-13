import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  API_URL = 'http://app.inventarios_api/api/';
  //API_URL = 'http://10.10.10.101/gits/inventarios_api/public/api/';

  API_SERVER = "https://inventarioitst.abzoft.com";

  constructor() { }
}
