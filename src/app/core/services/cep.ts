import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  constructor(private http: HttpClient) { }
  lookup(cep: string): Observable<any> {
    return this.http.post('/mock/cep', { cep });
  }
}
