import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfessionsService {
  constructor(private http: HttpClient) {}
  list(): Observable<string[]> {
    return this.http.get<string[]>('/mock/profissoes');
  }
}
