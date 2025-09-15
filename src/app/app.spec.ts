import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { of, Subject } from 'rxjs';
import { FormStore } from './core/services/form-state';
import { CepService } from './core/services/cep';
import { ProfessionsService } from './core/services/professions';
import jsPDF from 'jspdf';
import { provideZonelessChangeDetection } from '@angular/core';

describe('App Component', () => {
  let component: App;
  let storeSpy: jasmine.SpyObj<FormStore>;
  let cepServiceSpy: jasmine.SpyObj<CepService>;
  let professionsServiceSpy: jasmine.SpyObj<ProfessionsService>;
  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;
  let jsPDFMock: jasmine.SpyObj<jsPDF>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj('FormStore', [
      'data',
      'updatePersonal',
      'updateAddress',
      'updateProfessional',
    ]);
    jsPDFMock = jasmine.createSpyObj('jsPDF', ['setFontSize', 'text', 'save']);
    cepServiceSpy = jasmine.createSpyObj('CepService', ['lookup']);
    professionsServiceSpy = jasmine.createSpyObj('ProfessionsService', ['list']);
    breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);

    storeSpy.data.and.returnValue({
      personal: { nome: '', nascimento: '', cpf: '', telefone: '' },
      address: { cep: '', rua: '', bairro: '', cidade: '', estado: '' },
      professional: { profissao: '', empresa: '', salario: '' }
    });

    cepServiceSpy.lookup.and.returnValue(of({ rua: 'Rua Teste', bairro: 'Centro', cidade: 'SP', estado: 'SP' }));
    professionsServiceSpy.list.and.returnValue(of(['Dev']));
    breakpointObserverSpy.observe.and.returnValue(of({ matches: false } as BreakpointState));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, App],
      providers: [
        FormBuilder,
        { provide: FormStore, useValue: storeSpy },
        { provide: CepService, useValue: cepServiceSpy },
        { provide: ProfessionsService, useValue: professionsServiceSpy },
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
        provideZonelessChangeDetection()
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required controls', () => {
    component.ngOnInit();
    expect(component.form.contains('personal')).toBeTrue();
    expect(component.form.contains('address')).toBeTrue();
    expect(component.form.contains('professional')).toBeTrue();
  });

  it('should patch form with data from store', () => {
    const mockData = {
      personal: { nome: 'Teste', nascimento: '2000-01-01', cpf: '123', telefone: '999' },
      address: { cep: '12345678', rua: 'Rua A', bairro: 'Bairro', cidade: 'Cidade', estado: 'SP' },
      professional: { profissao: 'Dev', empresa: 'Empresa', salario: '1000' },
    };
    storeSpy.data.and.returnValue(mockData);

    component.ngOnInit();
    expect(component.form.value.personal.nome).toBe('Teste');
    expect(component.form.value.address.rua).toBe('Rua A');
    expect(component.form.value.professional.profissao).toBe('Dev');
  });

  it('should call updatePersonal when nextStepSavePersonal is called', () => {
    component.ngOnInit();
    component.personal.setValue({ nome: 'A', nascimento: 'B', cpf: 'C', telefone: 'D' });
    component.nextStepSavePersonal();
    expect(storeSpy.updatePersonal).toHaveBeenCalledWith(component.personal.value);
  });

  it('should call updateAddress when nextStepSaveResidencial is called', () => {
    component.ngOnInit();
    component.address.setValue({ cep: '1', rua: '2', bairro: '3', cidade: '4', estado: '5' });
    component.nextStepSaveResidencial();
    expect(storeSpy.updateAddress).toHaveBeenCalledWith(component.address.value);
  });

  it('should call updateProfessional when finishSaveProfessional is called', () => {
    component.ngOnInit();
    component.professional.setValue({ profissao: 'Dev', empresa: 'Empresa', salario: '2000' });
    component.finishSaveProfessional();
    expect(storeSpy.updateProfessional).toHaveBeenCalledWith(component.professional.value);
  });

  it('should set isHandset$ observable correctly', (done) => {
    breakpointObserverSpy.observe.and.returnValue(of({ matches: true } as BreakpointState));
    component = TestBed.createComponent(App).componentInstance;

    component.isHandset$.subscribe(value => {
      expect(value).toBeTrue();
      done();
    });
  });
});