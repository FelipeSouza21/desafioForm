import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalDataComponent } from './professional-data';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

describe('ProfessionalData', () => {
  let component: ProfessionalDataComponent;
  let fixture: ComponentFixture<ProfessionalDataComponent>;
  let form: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalDataComponent,
        ReactiveFormsModule
      ],
      providers: [FormBuilder,
        provideZonelessChangeDetection()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProfessionalDataComponent);
    component = fixture.componentInstance;

    const fb = TestBed.inject(FormBuilder);
    form = fb.group({
      profissao: [''],
      empresa: [''],
      salario: ['']
    });


    component.parentForm = form;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

