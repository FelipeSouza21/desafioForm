import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Observable, debounceTime, distinctUntilChanged, filter, map, shareReplay, startWith } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import jsPDF from 'jspdf';

import { FormStore } from './core/services/form-state';
import { CepService } from './core/services/cep';
import { ProfessionsService } from './core/services/professions';
import { SchemaFormBuilderService } from './core/services/schema-form-builder.service';
import { DynamicSectionComponent } from './shared/components/dynamic-section/dynamic-section.component';
import { FORM_SCHEMA } from './configs/form-schema.config';
import { FormSchema } from './shared/models/field-schema.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatStepperModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatDivider,
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
    DynamicSectionComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  form!: FormGroup;
  formSchema: FormSchema = FORM_SCHEMA;
  protected readonly title = signal('desafio-forms');
  isHandset$: Observable<boolean>;
  profissoes$ = new Observable<string[]>();
  fieldOptions: Record<string, any[]> = {};

  constructor(
    private breakpointObserver: BreakpointObserver,
    public store: FormStore,
    private cepService: CepService,
    private schemaBuilder: SchemaFormBuilderService,
    private professionsService: ProfessionsService,
  ) {
    this.isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {
    // Constrói o formulário a partir do schema
    this.form = this.schemaBuilder.buildForm(this.formSchema);

    // Preenche com dados existentes
    const data = this.store.data();
    if (data) {
      this.schemaBuilder.patchFormFromData(this.form, data);
    }

    // Configura CEP autocomplete
    this.setupCepAutocomplete();

    // Carrega opções de profissões
    this.loadProfessions();
  }

  private setupCepAutocomplete(): void {
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
  }

  private loadProfessions(): void {
    this.profissoes$ = this.professionsService.list().pipe(
      map(list => Array.isArray(list) ? list : []),
      startWith([])
    );

    this.profissoes$.subscribe(profissoes => {
      this.fieldOptions['profissao'] = profissoes.map(p => ({
        label: p,
        value: p
      }));
    });
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

  getFormGroup(sectionId: string): FormGroup {
    return this.form.get(sectionId) as FormGroup;
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

  saveStep(sectionId: string): void {
    const sectionValue = this.form.get(sectionId)?.value;
    
    switch(sectionId) {
      case 'personal':
        this.store.updatePersonal(sectionValue);
        break;
      case 'address':
        this.store.updateAddress(sectionValue);
        break;
      case 'professional':
        this.store.updateProfessional(sectionValue);
        break;
    }
  }

  exportPdf() {
    const { personal, address, professional } = this.store.data();
    const doc = new jsPDF();
    doc.setFontSize(12);
    
    const lines = [
      'Resumo do Formulário',
      `Nome: ${personal.nome || '-'}`, 
      `Nascimento: ${personal.nascimento || '-'}`,
      `CPF: ${personal.cpf || '-'}`, 
      `Telefone: ${personal.telefone || '-'}`, '',
      `CEP: ${address.cep || '-'}`, 
      `Endereço: ${address.rua || '-'}`,
      `Bairro: ${address.bairro || '-'}`, 
      `Cidade: ${address.cidade || '-'}`, 
      `Estado: ${address.estado || '-'}`, '',
      `Profissão: ${professional.profissao || '-'}`, 
      `Empresa: ${professional.empresa || '-'}`, 
      `Salário: ${professional.salario || '-'}`
    ];

    lines.forEach((line, i) => 
      line && doc.text(line, 10, i === 0 ? 10 : 20 + (i - 1) * 8)
    );

    doc.save('resumo.pdf');
  }
}