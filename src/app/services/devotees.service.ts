import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DevoteesService {
  //HOST_URL = 'http://localhost:2200';
  HOST_URL = 'https://6a0bf579dbbf.ngrok-free.app';
  API_URL = `${this.HOST_URL}/api/devotees`;

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

  // editDeletTurn(idTurn: number, turnData: object) {
  //   return this.http.put(`${this.API_URL}/${idTurn}`, turnData, {
  //     headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
  //   });
  // }
}
