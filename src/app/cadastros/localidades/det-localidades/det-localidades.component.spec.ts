import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetLocalidadesComponent } from './det-localidades.component';

describe('DetLocalidadesComponent', () => {
  let component: DetLocalidadesComponent;
  let fixture: ComponentFixture<DetLocalidadesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetLocalidadesComponent]
    });
    fixture = TestBed.createComponent(DetLocalidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
