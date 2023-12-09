import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public static API_URL = 'http://localhost:8080/api';
}
