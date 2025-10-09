import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FieldSchema } from '../../models/field-schema.model';

@Component({
  selector: 'app-dynamic-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskDirective,
  ],
  template: `
    <div [formGroup]="form">
      @switch (field.type) {
        @case ('date') {
          <mat-form-field appearance="outline" [class]="field.cssClass">
            <mat-label>{{ field.label }}</mat-label>
            <input 
              matInput 
              [matDatepicker]="picker" 
              [formControlName]="field.name"
              [placeholder]="field.placeholder || ''"
              [readonly]="field.readonly || false" />
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            @if (hasError()) {
              <mat-error>{{ getErrorMessage() }}</mat-error>
            }
          </mat-form-field>
        }
        @case ('select') {
          <mat-form-field appearance="outline" [class]="field.cssClass">
            <mat-label>{{ field.label }}</mat-label>
            <mat-select [formControlName]="field.name">
              @for (option of options; track option.value) {
                <mat-option [value]="option.value">{{ option.label }}</mat-option>
              }
            </mat-select>
            @if (hasError()) {
              <mat-error>{{ getErrorMessage() }}</mat-error>
            }
          </mat-form-field>
        }
        @case ('currency') {
          <mat-form-field appearance="outline" [class]="field.cssClass">
            <mat-label>{{ field.label }}</mat-label>
            <input 
              matInput 
              [formControlName]="field.name"
              [mask]="field.mask || ''"
              [prefix]="field.prefix || ''"
              thousandSeparator="."
              decimalMarker="," />
            @if (hasError()) {
              <mat-error>{{ getErrorMessage() }}</mat-error>
            }
          </mat-form-field>
        }
        @default {
          <mat-form-field appearance="outline" [class]="field.cssClass">
            <mat-label>{{ field.label }}</mat-label>
            <input 
              matInput 
              [formControlName]="field.name"
              [placeholder]="field.placeholder || ''"
              [mask]="field.mask || ''"
              [readonly]="field.readonly || false" />
            @if (field.prefix) {
              <span matPrefix>{{ field.prefix }}</span>
            }
            @if (field.suffix) {
              <span matSuffix>{{ field.suffix }}</span>
            }
            @if (hasError()) {
              <mat-error>{{ getErrorMessage() }}</mat-error>
            }
            @if (field.hint) {
              <mat-hint>{{ field.hint }}</mat-hint>
            }
          </mat-form-field>
        }
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .full {
      width: 100%;
    }
  `],
  providers: [provideNgxMask()]
})
export class DynamicFieldComponent {
  @Input() field!: FieldSchema;
  @Input() form!: FormGroup;
  @Input() options: any[] = [];

  hasError(): boolean {
    const control = this.form.get(this.field.name);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(): string {
    const control = this.form.get(this.field.name);
    if (!control || !control.errors) return '';

    const errorKey = Object.keys(control.errors)[0];
    return this.field.errorMessages?.[errorKey] || 'Campo inválido';
  }
}