import { Validators } from '@angular/forms';
import { FormSchema } from '../shared/models/field-schema.model';
import { cpfValidator } from '../shared/validators/cpf.validator';

export const FORM_SCHEMA: FormSchema = {
  sections: [
    {
      id: 'personal',
      title: 'Dados Pessoais',
      fields: [
        {
          name: 'nome',
          label: 'Nome completo',
          type: 'text',
          validators: [Validators.required],
          cssClass: 'full',
          errorMessages: {
            required: 'Nome é obrigatório'
          }
        },
        {
          name: 'nascimento',
          label: 'Data de nascimento',
          type: 'date',
          placeholder: 'dd/mm/aaaa',
          validators: [Validators.required],
          readonly: true,
          errorMessages: {
            required: 'Data de nascimento é obrigatória'
          }
        },
        {
          name: 'cpf',
          label: 'CPF',
          type: 'cpf',
          mask: '000.000.000-00',
          validators: [cpfValidator()],
          errorMessages: {
            cpfInvalid: 'CPF inválido'
          }
        },
        {
          name: 'telefone',
          label: 'Telefone',
          type: 'tel',
          mask: '(00) 00000-0000',
          validators: [Validators.required],
          errorMessages: {
            required: 'Telefone é obrigatório'
          }
        }
      ],
      layout: 'row'
    },
    {
      id: 'address',
      title: 'Endereço',
      fields: [
        {
          name: 'cep',
          label: 'CEP',
          type: 'cep',
          mask: '00000-000',
          placeholder: '00000-000',
          validators: [Validators.required],
          cssClass: 'full',
          errorMessages: {
            required: 'CEP é obrigatório'
          }
        },
        {
          name: 'rua',
          label: 'Endereço',
          type: 'text',
          validators: [Validators.required],
          cssClass: 'full',
          errorMessages: {
            required: 'Endereço é obrigatório'
          }
        },
        {
          name: 'bairro',
          label: 'Bairro',
          type: 'text',
          validators: [Validators.required],
          errorMessages: {
            required: 'Bairro é obrigatório'
          }
        },
        {
          name: 'cidade',
          label: 'Cidade',
          type: 'text',
          validators: [Validators.required],
          errorMessages: {
            required: 'Cidade é obrigatória'
          }
        },
        {
          name: 'estado',
          label: 'Estado',
          type: 'text',
          validators: [Validators.required],
          errorMessages: {
            required: 'Estado é obrigatório'
          }
        }
      ],
      layout: 'row'
    },
    {
      id: 'professional',
      title: 'Profissão',
      fields: [
        {
          name: 'profissao',
          label: 'Profissão',
          type: 'select',
          validators: [Validators.required],
          cssClass: 'full',
          errorMessages: {
            required: 'Profissão é obrigatória'
          }
        },
        {
          name: 'empresa',
          label: 'Empresa',
          type: 'text',
          validators: [Validators.required],
          cssClass: 'full',
          errorMessages: {
            required: 'Empresa é obrigatória'
          }
        },
        {
          name: 'salario',
          label: 'Salário',
          type: 'currency',
          mask: 'separator.2',
          prefix: 'R$ ',
          validators: [Validators.required],
          cssClass: 'full',
          errorMessages: {
            required: 'Salário é obrigatório'
          }
        }
      ],
      layout: 'single'
    }
  ]
};