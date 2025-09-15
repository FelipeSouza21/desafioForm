// import { TestBed } from '@angular/core/testing';
// import { of } from 'rxjs';
// import { CepService } from './cep';
// import { provideHttpClientTesting, HttpClientTestingModule } from '@angular/common/http/testing';
// import { provideZonelessChangeDetection } from '@angular/core';

// describe('CepService', () => {
//   let service: CepService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         CepService,
//         provideHttpClientTesting(),     
//         provideZonelessChangeDetection() 
//       ]
//     });

//     service = TestBed.inject(CepService);

//     spyOn(service, 'lookup').and.callFake((cep: string) => {
//       return of({ cep, city: 'São Paulo' });
//     });
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('lookup should return mocked response', (done) => {
//     const testCep = '12345678';

//     service.lookup(testCep).subscribe(response => {
//       expect(response).toEqual({ cep: testCep, city: 'São Paulo' });
//       done();
//     });
//   });

//   it('lookup should be called with correct parameter', () => {
//     const testCep = '87654321';
//     service.lookup(testCep).subscribe();
//     expect(service.lookup).toHaveBeenCalledWith(testCep);
//   });
// });


import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CepService } from './cep';
import { provideZonelessChangeDetection } from '@angular/core';

describe('CepService', () => {
  let service: CepService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CepService,
        provideZonelessChangeDetection()
      ]
    });

    service = TestBed.inject(CepService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica se não há requisições HTTP pendentes
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make POST request to correct endpoint with correct payload', () => {
    const testCep = '01310-100';
    const mockResponse = {
      cep: '01310-100',
      logradouro: 'Avenida Paulista',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP'
    };

    // Chama o método
    service.lookup(testCep).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    // Verifica se a requisição foi feita corretamente
    const req = httpTestingController.expectOne('/mock/cep');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ cep: testCep });

    // Simula a resposta do servidor
    req.flush(mockResponse);
  });

  it('should handle different CEP formats', () => {
    const testCases = [
      '12345678',
      '12345-678',
      '01310100',
      '01310-100'
    ];

    testCases.forEach(cep => {
      const mockResponse = { cep, city: 'Test City' };

      service.lookup(cep).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne('/mock/cep');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ cep });
      req.flush(mockResponse);
    });
  });

  it('should handle HTTP error responses', () => {
    const testCep = '00000000';
    const errorMessage = 'CEP não encontrado';

    service.lookup(testCep).subscribe({
      next: () => fail('Should have failed with 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpTestingController.expectOne('/mock/cep');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ cep: testCep });

    // Simula erro HTTP
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });

  it('should handle network errors', () => {
    const testCep = '12345678';

    service.lookup(testCep).subscribe({
      next: () => fail('Should have failed with network error'),
      error: (error) => {
        expect(error.name).toBe('HttpErrorResponse');
        expect(error.status).toBe(0);
      }
    });

    const req = httpTestingController.expectOne('/mock/cep');
    
    // Simula erro de rede
    req.error(new ProgressEvent('Network error'));
  });

  it('should handle empty CEP', () => {
    const emptyCep = '';
    const mockResponse = { error: 'CEP inválido' };

    service.lookup(emptyCep).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('/mock/cep');
    expect(req.request.body).toEqual({ cep: emptyCep });
    req.flush(mockResponse);
  });

  it('should handle null/undefined CEP', () => {
    const nullCep = null as any;
    
    service.lookup(nullCep).subscribe();

    const req = httpTestingController.expectOne('/mock/cep');
    expect(req.request.body).toEqual({ cep: nullCep });
    req.flush({});
  });

  it('should handle successful response with complete address data', () => {
    const testCep = '01310-100';
    const completeResponse = {
      cep: '01310-100',
      logradouro: 'Avenida Paulista',
      complemento: 'até 610 - lado par',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP',
      ibge: '3550308',
      gia: '1004',
      ddd: '11',
      siafi: '7107'
    };

    service.lookup(testCep).subscribe(response => {
      expect(response).toEqual(completeResponse);
      expect(response.cep).toBe(testCep);
      expect(response.localidade).toBe('São Paulo');
      expect(response.uf).toBe('SP');
    });

    const req = httpTestingController.expectOne('/mock/cep');
    req.flush(completeResponse);
  });
});