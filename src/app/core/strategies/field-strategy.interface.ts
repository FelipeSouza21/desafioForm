import { FormControl } from '@angular/forms';
import { FieldSchema } from '../../shared/models/field-schema.model';

export interface FieldStrategy {
  createControl(field: FieldSchema): FormControl;
  getComponent(): any;
}