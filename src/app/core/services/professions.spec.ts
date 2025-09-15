import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting, HttpClientTestingModule } from '@angular/common/http/testing';

import { ProfessionsService } from './professions';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ProfessionsService', () => {
  let service: ProfessionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfessionsService,
        provideZonelessChangeDetection(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProfessionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('list should GET /mock/profissoes and return array of strings', () => {
    const mockData = ['Desenvolvedor', 'Designer'];
    let response: string[] | undefined;

    service.list().subscribe(res => (response = res));

    const req = httpMock.expectOne('/mock/profissoes');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(response).toEqual(mockData);
  });

  it('list should propagate HTTP errors', () => {
    let caughtError: any;
    service.list().subscribe({
      next: () => {},
      error: err => (caughtError = err)
    });

    const req = httpMock.expectOne('/mock/profissoes');
    req.flush({ message: 'error' }, { status: 500, statusText: 'Server Error' });

    expect(caughtError).toBeTruthy();
  });
});

function provideExperimentalZonelessChangeDetection(): any {
  throw new Error('Function not implemented.');
}
