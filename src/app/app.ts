import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProfessionalDataComponent } from './features/professional-data/professional-data';
import { PersonalDataComponent } from './features/personal-data/personal-data';
import { AddressDataComponent } from './features/address-data/address-data';
import { Observable, debounceTime, distinctUntilChanged, filter, map, of, shareReplay, startWith } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FormStore } from './core/services/form-state';
import { CepService } from './core/services/cep';
import { ProfessionsService } from './core/services/professions';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-root',
  imports: [MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    AsyncPipe,
    JsonPipe,
    PersonalDataComponent,
    AddressDataComponent,
    ProfessionalDataComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  form!: FormGroup;
  protected readonly title = signal('desafio-forms');
  isHandset$: Observable<boolean>;
  profissoes$ = of<string[]>([]);

  constructor(
    private breakpointObserver: BreakpointObserver,
    public store: FormStore,
    private cepService: CepService,
    private fb: FormBuilder,
    private professionsService: ProfessionsService,
  ) {
    this.isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      personal: this.fb.group({
        nome: ['', Validators.required],
        nascimento: ['', Validators.required],
        cpf: ['', Validators.required],
        telefone: ['', Validators.required]
      }),
      address: this.fb.group({
        cep: ['', Validators.required],
        rua: ['', Validators.required],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', Validators.required]
      }),
      professional: this.fb.group({
        profissao: ['', Validators.required],
        empresa: ['', Validators.required],
        salario: ['', Validators.required]
      })
    });

    const data = this.store.data();
    if (data) this.form.patchValue(data);

    this.form.get('address.cep')!.valueChanges.pipe(
      map((v: string) => (v || '').replace(/\D/g, '')),
      debounceTime(400),
      distinctUntilChanged(),
      filter((v: string) => v.length === 8)
    ).subscribe((cep: string) => {
      this.cepService.lookup(cep).subscribe(res => {
        console.log('CEP lookup result:', res);
        this.form.patchValue({
          address: res
        });
        this.store.updateAddress(res);
      });
    });

    this.profissoes$ = this.professionsService.list().pipe(
      map(list => Array.isArray(list) ? list : []),
      startWith([])
    );
  }

  get personal() {
    return this.form.get('personal') as FormGroup;
  }

  get address() {
    return this.form.get('address') as FormGroup;
  }

  get professional() {
    return this.form.get('professional') as FormGroup;
  }

  nextStepSavePersonal() {
    this.store.updatePersonal(this.personal.value);
  }
  nextStepSaveResidencial() {
    this.store.updateAddress(this.address.value);
  }

  finishSaveProfessional() {
    this.store.updateProfessional(this.professional.value);
  }

  exportPdf() {
    const data = this.store.data();
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Resumo do Formulário', 10, 10);
    let y = 20;
    const push = (label: string, value: any) => {
      doc.text(`${label}: ${value || '-'}`, 10, y);
      y += 8;
    };

    push('Nome', data.personal.nome);
    push('Nascimento', data.personal.nascimento);
    push('CPF', data.personal.cpf);
    push('Telefone', data.personal.telefone);

    y += 4;
    push('CEP', data.address.cep);
    push('Endereço', data.address.rua);
    push('Bairro', data.address.bairro);
    push('Cidade', data.address.cidade);
    push('Estado', data.address.estado);

    y += 4;
    push('Profissão', data.professional.profissao);
    push('Empresa', data.professional.empresa);
    push('Salário', data.professional.salario);

    doc.save('resumo.pdf');
  }

}
