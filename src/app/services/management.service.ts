import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  API_URL = 'http://localhost:2200/api/management';

  constructor(private http: HttpClient) { }

  getFraternities() {
    return this.http.get(`${this.API_URL}/fraternities`,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  getPermissions() {
    return this.http.get(`${this.API_URL}/permissions`,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }
}
