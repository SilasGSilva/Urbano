import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetValidadoresComponent } from './det-validadores.component';

describe('DetValidadoresComponent', () => {
  let component: DetValidadoresComponent;
  let fixture: ComponentFixture<DetValidadoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetValidadoresComponent]
    });
    fixture = TestBed.createComponent(DetValidadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
