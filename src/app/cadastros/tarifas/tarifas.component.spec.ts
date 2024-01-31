import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifasComponent } from './tarifas.component';

describe('TarifasComponent', () => {
  let component: TarifasComponent;
  let fixture: ComponentFixture<TarifasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TarifasComponent]
    });
    fixture = TestBed.createComponent(TarifasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
