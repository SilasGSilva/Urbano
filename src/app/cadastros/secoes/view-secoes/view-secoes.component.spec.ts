import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSecoesComponent } from './view-secoes.component';

describe('ViewSecoesComponent', () => {
  let component: ViewSecoesComponent;
  let fixture: ComponentFixture<ViewSecoesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSecoesComponent]
    });
    fixture = TestBed.createComponent(ViewSecoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
