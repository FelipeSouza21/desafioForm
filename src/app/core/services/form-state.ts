import { Injectable, signal, computed } from '@angular/core';
import { AppFormData as FormData } from '../../shared/models/form-data.model';

@Injectable({ providedIn: 'root' })
export class FormStore {
  private _data = signal<FormData>({
    personal: { nome: '', nascimento: '', cpf: '', telefone: '' },
    address: { cep: '', rua: '', bairro: '', cidade: '', estado: '' },
    professional: { profissao: '', empresa: '', salario: '' }
  });

  data = computed(() => this._data());

  updatePersonal(p: Partial<FormData['personal']>) {
    this._data.update(s => ({ ...s, personal: { ...s.personal, ...p } }));
  }

  updateAddress(r: Partial<FormData['address']>) {
    this._data.update(s => ({ ...s, address: { ...s.address, ...r } }));
  }

  updateProfessional(pf: Partial<FormData['professional']>) {
    this._data.update(s => ({ ...s, professional: { ...s.professional, ...pf } }));
  }
}