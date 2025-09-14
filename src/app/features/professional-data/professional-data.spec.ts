import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalDataComponent } from './professional-data';

describe('ProfessionalData', () => {
  let component: ProfessionalDataComponent;
  let fixture: ComponentFixture<ProfessionalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
