import { Injectable } from '@angular/core';
import { FieldType } from '../../shared/models/field-schema.model';
import { FieldStrategy } from '../strategies/field-strategy.interface';
import { TextFieldStrategy } from '../strategies/text-field.strategy';
import { SelectFieldStrategy } from '../strategies/select-field.strategy';
import { DateFieldStrategy } from '../strategies/date-field.strategy';
import { CurrencyFieldStrategy } from '../strategies/currency-field.strategy';

@Injectable({ providedIn: 'root' })
export class FieldStrategyFactory {
  private strategies = new Map<FieldType, FieldStrategy>();

  constructor(
    private textStrategy: TextFieldStrategy,
    private selectStrategy: SelectFieldStrategy,
    private dateStrategy: DateFieldStrategy,
    private currencyStrategy: CurrencyFieldStrategy
  ) {
    this.initStrategies();
  }

  private initStrategies(): void {
    this.strategies.set('text', this.textStrategy);
    this.strategies.set('email', this.textStrategy);
    this.strategies.set('tel', this.textStrategy);
    this.strategies.set('cpf', this.textStrategy);
    this.strategies.set('cep', this.textStrategy);
    this.strategies.set('select', this.selectStrategy);
    this.strategies.set('date', this.dateStrategy);
    this.strategies.set('currency', this.currencyStrategy);
    this.strategies.set('number', this.textStrategy);
  }

  getStrategy(type: FieldType): FieldStrategy {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`Strategy not found for field type: ${type}`);
    }
    return strategy;
  }

  registerStrategy(type: FieldType, strategy: FieldStrategy): void {
    this.strategies.set(type, strategy);
  }
}