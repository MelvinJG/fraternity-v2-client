import { Injectable } from '@angular/core';
import { Constants } from '../utils/Constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  API_URL = `${Constants.HOST_URL}/api/dashboard`;

  constructor(private http: HttpClient) { }

  getIncomePerDay() {
    return this.http.get(`${this.API_URL}/incomePerDay`,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  getIncomePerDay2() {
    return this.http.get(`${this.API_URL}/incomePerDay2`,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  getIncomePerDayWithTurns() {
    return this.http.get(`${this.API_URL}/incomePerDayWithTurns`,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }
}
