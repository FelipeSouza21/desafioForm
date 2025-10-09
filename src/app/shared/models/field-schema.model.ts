import { ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export type FieldType = 
  | 'text' 
  | 'email' 
  | 'tel' 
  | 'number' 
  | 'date' 
  | 'select' 
  | 'currency' 
  | 'cpf' 
  | 'cep';

export interface FieldOption {
  label: string;
  value: any;
}

export interface FieldSchema {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  mask?: string;
  validators?: ValidatorFn[];
  options?: FieldOption[] | Observable<FieldOption[]>;
  readonly?: boolean;
  prefix?: string;
  suffix?: string;
  hint?: string;
  errorMessages?: Record<string, string>;
  cssClass?: string;
  dependsOn?: string;
  condition?: (formValue: any) => boolean;
}

export interface FormSectionSchema {
  id: string;
  title: string;
  fields: FieldSchema[];
  layout?: 'single' | 'row' | 'grid';
}

export interface FormSchema {
  sections: FormSectionSchema[];
}