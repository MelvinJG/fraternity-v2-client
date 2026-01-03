import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../utils/Constants';

@Injectable({
  providedIn: 'root'
})
export class DevoteesService {
  API_URL = `${Constants.HOST_URL}/api/devotees`;

  constructor(private http: HttpClient) { }

  createDevotee(devoteeData: object) {
    return this.http.post(`${this.API_URL}`, devoteeData, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  getDevoteeByDPI(dpi: string) {
    return this.http.get(`${this.API_URL}/${dpi}`,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  updateDevotee(dpiDevote: string, devoteeData: object) {
    return this.http.put(`${this.API_URL}/${dpiDevote}`, devoteeData, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }
}
