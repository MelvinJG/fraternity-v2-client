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
  exp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  API_URL = `${Constants.HOST_URL}/api/users`;

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' && this.hasValidToken();

    if (!isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('token');
    }

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
    if (this.isLoggedInSubject.value && !this.hasValidToken()) {
      this.logout();
      return false;
    }

    return this.isLoggedInSubject.value;
  }

  getUserInfo() {
    if(this.isLoggedInSubject.value && this.hasValidToken()) {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode<JwtCustomPayload>(token!);
      return decoded;
    }
    return null;
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode<JwtCustomPayload>(token);

      if (!decoded.exp) {
        return false;
      }

      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
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
