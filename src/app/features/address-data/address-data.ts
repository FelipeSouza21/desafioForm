import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CepService } from '../../core/services/cep';
import { FormStore } from '../../core/services/form-state';
import { map, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-address-data',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './address-data.html',
  styleUrl: './address-data.scss'
})
export class AddressDataComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cepService: CepService,
    private store: FormStore
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      cep: ['', Validators.required],
      rua: [''],
      bairro: [''],
      cidade: [''],
      estado: ['']
    });

    const data = this.store.data();
    if (data) this.form.patchValue(data);

    this.form.get('cep')!.valueChanges.pipe(
      map((v: string) => (v || '').replace(/\D/g, '')),
      debounceTime(400),
      distinctUntilChanged(),
      filter((v: string) => v.length === 8)
    ).subscribe((cep: string) => {
      this.cepService.lookup(cep).subscribe(res => {
        this.form.patchValue(res);
        this.store.updateAddress(res);
      });
    });
  }

nextStepSaveResidencial() {
  this.store.updateAddress(this.form.value);
}
}
