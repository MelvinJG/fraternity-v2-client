import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../utils/Constants';

export interface CreateOfferingRequest {
  receiptSeries: 'OFR';
  idempotencyKey: string;
  name: string;
  amount: number;
  createdBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfferingService {
  API_URL = `${Constants.HOST_URL}/api/offering`;

  constructor(private http: HttpClient) { }

  create(offeringData: CreateOfferingRequest) {
    return this.http.post(`${this.API_URL}`, offeringData, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  getOfferings(page: number = 1) {
    return this.http.get(`${this.API_URL}?page=${page}&limit=30`,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  getOfferingByName(name: string, page: number = 1) {
    return this.http.get(`${this.API_URL}/name/${encodeURIComponent(name)}?page=${page}&limit=30`,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  deleteOffering(idOffering: string, offeringData: object) {
    return this.http.put(`${this.API_URL}/${idOffering}`, offeringData, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  getKpis() {
    return this.http.get(`${this.API_URL}/kpis`,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }
}
