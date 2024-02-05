import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMotoristaComponent } from './view-motorista.component';

describe('ViewMotoristaComponent', () => {
  let component: ViewMotoristaComponent;
  let fixture: ComponentFixture<ViewMotoristaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMotoristaComponent]
    });
    fixture = TestBed.createComponent(ViewMotoristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
