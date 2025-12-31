import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Constants } from '../utils/Constants';

@Injectable({
  providedIn: 'root'
})
export class TurnsService {
  API_URL = `${Constants.HOST_URL}/api/turns`;

  constructor(private http: HttpClient) { }

  createTurn(turnData: object) {
    return this.http.post(`${this.API_URL}`, turnData, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  getTurns() {
    return this.http.get(`${this.API_URL}`,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  editDeletTurn(idTurn: number, turnData: object) {
    return this.http.put(`${this.API_URL}/${idTurn}`, turnData, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }
}
