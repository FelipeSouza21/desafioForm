import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormSchema, FieldSchema } from '../../shared/models/field-schema.model';
import { FieldStrategyFactory } from '../factories/field-strategy.factory';

@Injectable({ providedIn: 'root' })
export class SchemaFormBuilderService {
  constructor(
    private fb: FormBuilder,
    private strategyFactory: FieldStrategyFactory
  ) {}

  buildForm(schema: FormSchema): FormGroup {
    const group: Record<string, FormGroup> = {};

    for (const section of schema.sections) {
      group[section.id] = this.buildSection(section.fields);
    }

    return this.fb.group(group);
  }

  private buildSection(fields: FieldSchema[]): FormGroup {
    const controls: Record<string, FormControl> = {};

    for (const field of fields) {
      const strategy = this.strategyFactory.getStrategy(field.type);
      controls[field.name] = strategy.createControl(field);
    }

    return this.fb.group(controls);
  }

  patchFormFromData(form: FormGroup, data: any): void {
    if (data) {
      form.patchValue(data);
    }
  }
}