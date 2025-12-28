import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService {
  //HOST_URL = 'http://localhost:2200';
  HOST_URL = 'https://6a0bf579dbbf.ngrok-free.app';
  API_URL = `${this.HOST_URL}/api/inscriptions`;

  constructor(private http: HttpClient) { }

  registration(receiptData: object) {
    return this.http.post(`${this.API_URL}`, receiptData, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  getInscriptions(page: number = 1) {
    return this.http.get(`${this.API_URL}?page=${page}&limit=30`,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  getInscriptionsByDPI(dpi: string, page: number = 1) {
    return this.http.get(`${this.API_URL}/${dpi}?page=${page}&limit=30`,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  deleteInscription(idInscription: number, turnData: object) {
    return this.http.delete(`${this.API_URL}/${idInscription}`, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' },
      body: turnData
    });
  }

  report() {
    return this.http.get(`${this.API_URL}/reports`,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }
}
