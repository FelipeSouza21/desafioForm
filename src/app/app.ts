import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProfessionalDataComponent } from './features/professional-data/professional-data';
import { SummaryComponent } from './features/summary/summary';
import { PersonalDataComponent } from './features/personal-data/personal-data';
import { AddressDataComponent } from './features/address-data/address-data';
import { Observable, map, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { FormStore } from './core/services/form-state';

@Component({
  selector: 'app-root',
  imports: [MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    AsyncPipe,
    PersonalDataComponent,
    AddressDataComponent,
    ProfessionalDataComponent,
    SummaryComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('desafio-forms');
  isHandset$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver, public store: FormStore) {
    this.isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  isPersonalComplete(): boolean {
    const p = this.store.data();
    return !!(p.personal.nome && p.personal.nascimento && p.personal.cpf && p.personal.telefone);
  }

  isAddressComplete(): boolean {
    const p = this.store.data();
    return !!(p.address.cep && p.address.rua && p.address.bairro && p.address.cidade && p.address.estado);
  }
}
