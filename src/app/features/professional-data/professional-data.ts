import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormStore } from '../../core/services/form-state';
import { ProfessionsService } from '../../core/services/professions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { AsyncPipe } from '@angular/common';
import { map, of, startWith } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-professional-data',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    AsyncPipe
  ],
  templateUrl: './professional-data.html',
  styleUrl: './professional-data.scss'
})
export class ProfessionalDataComponent implements OnInit {
  form!: FormGroup;
  profissoes$ = of<string[]>([]);
  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private fb: FormBuilder,
    private professionsService: ProfessionsService,
    private store: FormStore
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      profissao: ['', Validators.required],
      empresa: [''],
      salario: ['', Validators.required]
    });

    this.profissoes$ = this.professionsService.list().pipe(
      map(list => Array.isArray(list) ? list : []),
      startWith([])
    );

    const data = this.store.data();
    if (data) this.form.patchValue(data);
  }

  finishSaveProfessional() {
    this.store.updateProfessional(this.form.get('profissional')!.value);
  }
}