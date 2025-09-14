import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalData } from './professional-data';

describe('ProfessionalData', () => {
  let component: ProfessionalData;
  let fixture: ComponentFixture<ProfessionalData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
