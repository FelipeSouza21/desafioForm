import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDataComponent } from './personal-data';
import { provideZonelessChangeDetection } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

describe('PersonalData', () => {
  let component: PersonalDataComponent;
  let fixture: ComponentFixture<PersonalDataComponent>;
  let form: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalDataComponent,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        provideZonelessChangeDetection()],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PersonalDataComponent);
    component = fixture.componentInstance;

    const fb = TestBed.inject(FormBuilder);
    form = fb.group({
      nome: [''],
      nascimento: [''],
      cpf: [''],
      telefone: ['']
    });


      component.parentForm = form;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
  function provideExperimentalZonelessChangeDetection(): any {
    throw new Error('Function not implemented.');
  }

