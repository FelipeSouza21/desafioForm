import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldStrategy } from './field-strategy.interface';
import { FieldSchema } from '../../shared/models/field-schema.model';

@Injectable({ providedIn: 'root' })
export class SelectFieldStrategy implements FieldStrategy {
  createControl(field: FieldSchema): FormControl {
    const validators = field.validators || [];
    return new FormControl('', validators);
  }

  getComponent() {
    return 'select-input';
  }
}