import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.endsWith('/mock/cep') && req.method === 'POST') {
      const { cep } = req.body || {};
      const res = {
        rua: 'Av. Exemplo, 123',
        bairro: 'Centro',
        cidade: 'Recife',
        estado: 'PE'
      };
      return of(new HttpResponse({ status: 200, body: res })).pipe(delay(500));
    }

    if (req.url.endsWith('/mock/profissoes') && req.method === 'GET') {
      const profs = [
        'Desenvolvedor Front-end',
        'Desenvolvedor Back-end',
        'Designer UI/UX',
        'Analista de QA',
        'Gerente de Produto'
      ];
      return of(new HttpResponse({ status: 200, body: profs })).pipe(delay(300));
    }

    return next.handle(req);
  }
}