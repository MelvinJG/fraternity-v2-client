import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Constants } from '../utils/Constants';

// Interfaz para el payload del JWT
interface JwtCustomPayload {
  dpi: string;
  fullName: string;
  email: string;
  idFraternity: number;
  idPermission: number;
  fraternityName: string;
  permissionDescription: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  API_URL = `${Constants.HOST_URL}/api/users`;

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedInSubject.next(isLoggedIn);
  }

  login() {
    localStorage.setItem('isLoggedIn', 'true');
    this.isLoggedInSubject.next(true);
  }

  signin(user: object) {
    return this.http.post(`${this.API_URL}/signin`,user);
  }

  logout() {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }

  getLoginStatus(): boolean {
    return this.isLoggedInSubject.value;
  }

  getUserInfo() {
    if(this.isLoggedInSubject.value) {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode<JwtCustomPayload>(token!);
      return decoded;
    }
    return null;
  }

  createUser(user: object) {
    return this.http.post(`${this.API_URL}/create`,user,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  listUsers() {
    return this.http.get(`${this.API_URL}/list`,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }

  //ACTUALIZAR O ELIMINAR USUARIO
  editDeleteUser(dpi: string, user: object) {
    return this.http.put(`${this.API_URL}/update/${dpi}`,user,{
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') || '' }
    });
  }
}
