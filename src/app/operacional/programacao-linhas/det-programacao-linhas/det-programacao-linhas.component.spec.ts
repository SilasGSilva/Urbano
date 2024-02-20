import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetProgramacaoLinhasComponent } from './det-programacao-linhas.component';

describe('DetProgramacaoLinhasComponent', () => {
  let component: DetProgramacaoLinhasComponent;
  let fixture: ComponentFixture<DetProgramacaoLinhasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetProgramacaoLinhasComponent]
    });
    fixture = TestBed.createComponent(DetProgramacaoLinhasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
