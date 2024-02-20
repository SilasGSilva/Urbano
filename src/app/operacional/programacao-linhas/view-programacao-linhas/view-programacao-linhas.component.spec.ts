import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProgramacaoLinhasComponent } from './view-programacao-linhas.component';

describe('ViewProgramacaoLinhasComponent', () => {
  let component: ViewProgramacaoLinhasComponent;
  let fixture: ComponentFixture<ViewProgramacaoLinhasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewProgramacaoLinhasComponent]
    });
    fixture = TestBed.createComponent(ViewProgramacaoLinhasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
