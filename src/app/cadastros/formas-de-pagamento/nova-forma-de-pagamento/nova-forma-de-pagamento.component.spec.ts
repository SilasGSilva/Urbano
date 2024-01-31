import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaFormaDePagamentoComponent } from './nova-forma-de-pagamento.component';

describe('NovaFormaDePagamentoComponent', () => {
  let component: NovaFormaDePagamentoComponent;
  let fixture: ComponentFixture<NovaFormaDePagamentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NovaFormaDePagamentoComponent]
    });
    fixture = TestBed.createComponent(NovaFormaDePagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
