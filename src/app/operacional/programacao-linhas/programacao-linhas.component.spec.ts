import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacaoLinhasComponent } from './programacao-linhas.component';

describe('ProgramacaoLinhasComponent', () => {
  let component: ProgramacaoLinhasComponent;
  let fixture: ComponentFixture<ProgramacaoLinhasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramacaoLinhasComponent]
    });
    fixture = TestBed.createComponent(ProgramacaoLinhasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
