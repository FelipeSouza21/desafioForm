import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { MockBackendInterceptor } from './mock-backend.interceptor';
import { of } from 'rxjs';
import { provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';

describe('MockBackendInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let interceptor: MockBackendInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MockBackendInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MockBackendInterceptor,
          multi: true
        },
        provideZonelessChangeDetection()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    interceptor = TestBed.inject(MockBackendInterceptor);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('CEP endpoint', () => {
    it('should intercept POST request to /mock/cep and return mock response', (done) => {
      const testCep = '12345-678';
      const expectedResponse = {
        rua: 'Av. Exemplo, 123',
        bairro: 'Centro',
        cidade: 'Recife',
        estado: 'PE'
      };

      httpClient.post('/mock/cep', { cep: testCep }).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      httpTestingController.expectNone('/mock/cep');
    });

    it('should handle CEP request with null/undefined body', (done) => {
      const expectedResponse = {
        rua: 'Av. Exemplo, 123',
        bairro: 'Centro',
        cidade: 'Recife',
        estado: 'PE'
      };

      httpClient.post('/mock/cep', null).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      httpTestingController.expectNone('/mock/cep');
    });

    it('should handle CEP request with empty body', (done) => {
      const expectedResponse = {
        rua: 'Av. Exemplo, 123',
        bairro: 'Centro',
        cidade: 'Recife',
        estado: 'PE'
      };

      httpClient.post('/mock/cep', {}).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      httpTestingController.expectNone('/mock/cep');
    });

    it('should add delay to CEP response', (done) => {
      const startTime = Date.now();

      httpClient.post('/mock/cep', { cep: '12345-678' }).subscribe(() => {
        const endTime = Date.now();
        const elapsed = endTime - startTime;
        
        expect(elapsed).toBeGreaterThanOrEqual(400);
        done();
      });

      httpTestingController.expectNone('/mock/cep');
    });

    it('should not intercept non-POST requests to CEP endpoint', () => {
      httpClient.get('/mock/cep').subscribe();
      
      const req = httpTestingController.expectOne('/mock/cep');
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should not intercept POST requests to different CEP URLs', () => {
      httpClient.post('/api/cep', { cep: '12345' }).subscribe();
      
      const req = httpTestingController.expectOne('/api/cep');
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });

  describe('Profissões endpoint', () => {
    it('should intercept GET request to /mock/profissoes and return mock response', (done) => {
      const expectedProfissoes = [
        'Desenvolvedor Front-end',
        'Desenvolvedor Back-end',
        'Designer UI/UX',
        'Analista de QA',
        'Gerente de Produto'
      ];

      httpClient.get('/mock/profissoes').subscribe(response => {
        expect(response).toEqual(expectedProfissoes);
        expect(Array.isArray(response)).toBe(true);
        expect((response as string[]).length).toBe(5);
        done();
      });

      httpTestingController.expectNone('/mock/profissoes');
    });

    it('should add delay to profissões response', (done) => {
      const startTime = Date.now();

      httpClient.get('/mock/profissoes').subscribe(() => {
        const endTime = Date.now();
        const elapsed = endTime - startTime;
        
        expect(elapsed).toBeGreaterThanOrEqual(250);
        done();
      });

      httpTestingController.expectNone('/mock/profissoes');
    });

    it('should not intercept non-GET requests to profissões endpoint', () => {
      httpClient.post('/mock/profissoes', {}).subscribe();
      
      const req = httpTestingController.expectOne('/mock/profissoes');
      expect(req.request.method).toBe('POST');
      req.flush({});
    });

    it('should not intercept GET requests to different profissões URLs', () => {
      httpClient.get('/api/profissoes').subscribe();
      
      const req = httpTestingController.expectOne('/api/profissoes');
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });

  describe('Pass through behavior', () => {
    it('should pass through unmatched requests', () => {
      httpClient.get('/api/users').subscribe();
      
      const req = httpTestingController.expectOne('/api/users');
      expect(req.request.method).toBe('GET');
      req.flush({ users: [] });
    });

    it('should pass through requests to different domains', () => {
      httpClient.get('https://external-api.com/data').subscribe();
      
      const req = httpTestingController.expectOne('https://external-api.com/data');
      req.flush({ data: 'external' });
    });

    it('should pass through requests with query parameters', () => {
      httpClient.get('/api/search?q=test').subscribe();
      
      const req = httpTestingController.expectOne('/api/search?q=test');
      req.flush({ results: [] });
    });
  });

  describe('Direct interceptor testing', () => {
    let mockHandler: jasmine.SpyObj<HttpHandler>;

    beforeEach(() => {
      mockHandler = jasmine.createSpyObj('HttpHandler', ['handle']);
    });

    it('should create interceptor instance', () => {
      expect(interceptor).toBeTruthy();
    });

    it('should return HttpResponse for CEP request', (done) => {
      const request = new HttpRequest('POST', '/mock/cep', { cep: '12345' });
      
      const result = interceptor.intercept(request, mockHandler);
      
      result.subscribe(event => {
        if (event instanceof HttpResponse) {
          expect(event.status).toBe(200);
          expect(event.body).toEqual({
            rua: 'Av. Exemplo, 123',
            bairro: 'Centro',
            cidade: 'Recife',
            estado: 'PE'
          });
          done();
        }
      });

      expect(mockHandler.handle).not.toHaveBeenCalled();
    });

    it('should return HttpResponse for profissões request', (done) => {
      const request = new HttpRequest('GET', '/mock/profissoes');
      
      const result = interceptor.intercept(request, mockHandler);
      
      result.subscribe(event => {
        if (event instanceof HttpResponse) {
          expect(event.status).toBe(200);
          expect(Array.isArray(event.body)).toBe(true);
          expect((event.body as string[]).length).toBe(5);
          done();
        }
      });

      expect(mockHandler.handle).not.toHaveBeenCalled();
    });

    it('should call next handler for unmatched requests', () => {
      const request = new HttpRequest('GET', '/api/other');
      const mockResponse = of(new HttpResponse({ status: 200, body: {} }));
      mockHandler.handle.and.returnValue(mockResponse);
      
      const result = interceptor.intercept(request, mockHandler);
      
      expect(mockHandler.handle).toHaveBeenCalledWith(request);
      expect(result).toBe(mockResponse);
    });

    it('should handle requests with different URL patterns', () => {
      const testCases = [
        { url: '/some/path/mock/cep', method: 'POST', shouldIntercept: true },
        { url: '/mock/cep/extra', method: 'POST', shouldIntercept: false },
        { url: '/api/mock/profissoes', method: 'GET', shouldIntercept: true },
        { url: '/mock/profissoes/1', method: 'GET', shouldIntercept: false }
      ];

      testCases.forEach(testCase => {
        mockHandler.handle.calls.reset();
        const mockResponse = of(new HttpResponse({ status: 200 }));
        mockHandler.handle.and.returnValue(mockResponse);

        const request = new HttpRequest(testCase.method as any, testCase.url);
        interceptor.intercept(request, mockHandler);

        if (testCase.shouldIntercept) {
          expect(mockHandler.handle).not.toHaveBeenCalled();
        } else {
          expect(mockHandler.handle).toHaveBeenCalledWith(request);
        }
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle concurrent requests', (done) => {
      const requests = [
        httpClient.post('/mock/cep', { cep: '11111' }),
        httpClient.get('/mock/profissoes'),
        httpClient.post('/mock/cep', { cep: '22222' })
      ];

      let completedRequests = 0;
      
      requests.forEach(request => {
        request.subscribe(response => {
          expect(response).toBeDefined();
          completedRequests++;
          
          if (completedRequests === requests.length) {
            done();
          }
        });
      });

      httpTestingController.expectNone('/mock/cep');
      httpTestingController.expectNone('/mock/profissoes');
    });

    it('should maintain request headers and other properties', (done) => {
      const headers = { 'Authorization': 'Bearer token123' };
      
      httpClient.post('/mock/cep', { cep: '12345' }, { headers }).subscribe(response => {
        expect(response).toBeDefined();
        done();
      });

      httpTestingController.expectNone('/mock/cep');
    });
  });
});