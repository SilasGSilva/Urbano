import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetTarifasComponent } from './det-tarifas.component';

describe('DetTarifasComponent', () => {
  let component: DetTarifasComponent;
  let fixture: ComponentFixture<DetTarifasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetTarifasComponent]
    });
    fixture = TestBed.createComponent(DetTarifasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
