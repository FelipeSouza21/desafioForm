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
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { FormStore } from './core/services/form-state';
import { CepService } from './core/services/cep';
import { ProfessionsService } from './core/services/professions';
import jsPDF from 'jspdf';
import { cpfValidator } from './shared/validators/cpf.validator';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  imports: [MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
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
        cpf: ['', [cpfValidator()]],
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
  const { personal, address, professional } = this.store.data();
  const doc = new jsPDF();
  doc.setFontSize(12);
  
  const lines = [
    'Resumo do Formulário',
    `Nome: ${personal.nome || '-'}`, `Nascimento: ${personal.nascimento || '-'}`,
    `CPF: ${personal.cpf || '-'}`, `Telefone: ${personal.telefone || '-'}`, '',
    `CEP: ${address.cep || '-'}`, `Endereço: ${address.rua || '-'}`,
    `Bairro: ${address.bairro || '-'}`, `Cidade: ${address.cidade || '-'}`, `Estado: ${address.estado || '-'}`, '',
    `Profissão: ${professional.profissao || '-'}`, `Empresa: ${professional.empresa || '-'}`, `Salário: ${professional.salario || '-'}`
  ];

  lines.forEach((line, i) => 
    line && doc.text(line, 10, i === 0 ? 10 : 20 + (i - 1) * 8)
  );

  doc.save('resumo.pdf');
}

}
