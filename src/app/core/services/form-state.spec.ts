import { TestBed } from '@angular/core/testing';
import { FormStore } from './form-state';
import { provideZonelessChangeDetection } from '@angular/core';

describe('FormStore updates', () => {
  let service: FormStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(FormStore);
  });

  const expectedInitial = {
    personal: { nome: '', nascimento: '', cpf: '', telefone: '' },
    address: { cep: '', rua: '', bairro: '', cidade: '', estado: '' },
    professional: { profissao: '', empresa: '', salario: '' }
  };

  it('should have the correct initial state', () => {
    expect(service.data()).toEqual(expectedInitial);
  });

  it('updatePersonal should merge partial fields and not touch other sections', () => {
    service.updatePersonal({ nome: 'Ana Silva', cpf: '12345678900' });
    const d = service.data();
    expect(d.personal).toEqual({
      nome: 'Ana Silva',
      nascimento: '',
      cpf: '12345678900',
      telefone: ''
    });
    expect(d.address).toEqual(expectedInitial.address);
    expect(d.professional).toEqual(expectedInitial.professional);
  });

  it('updateAddress should merge partial fields and not touch other sections', () => {
    service.updateAddress({ cep: '1000-000', cidade: 'Lisboa' });
    const d = service.data();
    expect(d.address).toEqual({
      cep: '1000-000',
      rua: '',
      bairro: '',
      cidade: 'Lisboa',
      estado: ''
    });
    expect(d.personal).toEqual(expectedInitial.personal);
    expect(d.professional).toEqual(expectedInitial.professional);
  });

  it('updateProfessional should merge partial fields and not touch other sections', () => {
    service.updateProfessional({ profissao: 'Desenvolvedor', salario: '5000' });
    const d = service.data();
    expect(d.professional).toEqual({
      profissao: 'Desenvolvedor',
      empresa: '',
      salario: '5000'
    });
    expect(d.personal).toEqual(expectedInitial.personal);
    expect(d.address).toEqual(expectedInitial.address);
  });

  it('multiple updates should accumulate across sections', () => {
    service.updatePersonal({ nome: 'João' });
    service.updateAddress({ rua: 'Rua A' });
    service.updateProfessional({ empresa: 'Acme' });

    expect(service.data()).toEqual({
      personal: { nome: 'João', nascimento: '', cpf: '', telefone: '' },
      address: { cep: '', rua: 'Rua A', bairro: '', cidade: '', estado: '' },
      professional: { profissao: '', empresa: 'Acme', salario: '' }
    });
  });

  it('updating with an empty partial should not change the state', () => {
    const before = service.data();
    service.updatePersonal({});
    service.updateAddress({});
    service.updateProfessional({});
    expect(service.data()).toEqual(before);
  });
});

function provideExperimentalZonelessChangeDetection(): any {
  throw new Error('Function not implemented.');
}
