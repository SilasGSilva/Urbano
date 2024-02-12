import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetSecoesComponent } from './det-secoes.component';

describe('DetSecoesComponent', () => {
  let component: DetSecoesComponent;
  let fixture: ComponentFixture<DetSecoesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetSecoesComponent]
    });
    fixture = TestBed.createComponent(DetSecoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
