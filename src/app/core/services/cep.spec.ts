import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CepService } from './cep';

describe('CepService', () => {
  let service: CepService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CepService, provideHttpClientTesting]
    });
    service = TestBed.inject(CepService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('lookup should POST to /mock/cep and return response', (done) => {
    const cep = '12345678';
    const mockResponse = { cep, city: 'São Paulo' };

    service.lookup(cep).subscribe(response => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne('/mock/cep');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ cep });
    req.flush(mockResponse);
  });
});