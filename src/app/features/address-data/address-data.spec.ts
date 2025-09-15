import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddressDataComponent } from './address-data';
import { provideZonelessChangeDetection } from '@angular/core';

describe('AddressDataComponent', () => {
  let component: AddressDataComponent;
  let fixture: ComponentFixture<AddressDataComponent>;
  let form: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddressDataComponent],
      providers: [FormBuilder,
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddressDataComponent);
    component = fixture.componentInstance;

    const fb = TestBed.inject(FormBuilder);
    form = fb.group({
      cep: [''],
      rua: [''],
      bairro: [''],
      cidade: [''],
      estado: ['']
    });

    component.parentForm = form;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive parent form via @Input', () => {
    expect(component.parentForm).toBe(form);
  });

  it('should bind inputs to form controls', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cepInput = compiled.querySelector('input[formControlName="cep"]') as HTMLInputElement;

    cepInput.value = '12345678';
    cepInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(form.get('cep')?.value).toBe('12345678');
  });
});

