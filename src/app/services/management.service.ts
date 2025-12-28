import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ManagementService {
  //HOST_URL = 'http://localhost:2200';
  HOST_URL = 'https://6a0bf579dbbf.ngrok-free.app';
  API_URL = `${this.HOST_URL}/api/management`;

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
