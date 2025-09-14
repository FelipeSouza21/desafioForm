import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-professional-data',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    NgxMaskDirective
  ],
  templateUrl: './professional-data.html',
  styleUrl: './professional-data.scss',
  providers: [provideNgxMask()]
})
export class ProfessionalDataComponent {
  @Input() parentForm!: FormGroup;
  @Input() profissoes: string[] | null = [];
}