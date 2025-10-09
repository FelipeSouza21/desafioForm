import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormSectionSchema } from '../../models/field-schema.model';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-dynamic-section',
    standalone: true,
    imports: [ReactiveFormsModule, DynamicFieldComponent, NgClass],
    template: `
    <div [formGroup]="form" [ngClass]="getLayoutClass()">
      @for (field of section.fields; track field.name) {
        <app-dynamic-field 
          [field]="field" 
          [form]="form"
          [options]="getOptionsForField(field.name)">
        </app-dynamic-field>
      }
    </div>
  `,
    styles: [`
    .full {
      width: 100%;
      box-sizing: border-box;
    }

    .layout-single {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .layout-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .layout-row app-dynamic-field {
      flex: 1;
      min-width: 200px;
      margin-top: 1rem;
    }

    .layout-row app-dynamic-field:has(.full) {
      flex-basis: 100%;
    }

    .layout-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
  `]
})
export class DynamicSectionComponent {
    @Input() section!: FormSectionSchema;
    @Input() form!: FormGroup;
    @Input() fieldOptions: Record<string, any[]> = {};

    getLayoutClass(): string {
        return `layout-${this.section.layout || 'single'}`;
    }

    getOptionsForField(fieldName: string): any[] {
        return this.fieldOptions[fieldName] || [];
    }
}