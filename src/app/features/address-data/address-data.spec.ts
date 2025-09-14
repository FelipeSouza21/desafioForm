import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressData } from './address-data';

describe('AddressData', () => {
  let component: AddressData;
  let fixture: ComponentFixture<AddressData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
