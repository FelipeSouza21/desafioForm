import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormStore } from '../../core/services/form-state';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-personal-data',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    NgxMaskDirective
  ],
  templateUrl: './personal-data.html',
  styleUrls: ['./personal-data.scss'],
  providers: [provideNgxMask()]
})
export class PersonalDataComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: FormStore
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      personal: this.fb.group({
        nome: ['', Validators.required],
        nascimento: ['', Validators.required],
        cpf: ['', Validators.required],
        telefone: ['', Validators.required]
      }),
    });
  }

  get personal(): FormGroup {
    return this.form.get('personal') as FormGroup;
  }

  nextStepSavePersonal() {
    this.store.updatePersonal(this.personal.value);
  }
}