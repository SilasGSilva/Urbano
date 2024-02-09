import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetFormaPagamentoComponent } from './det-forma-pagamento.component';

describe('DetFormaPagamentoComponent', () => {
    let component: DetFormaPagamentoComponent;
    let fixture: ComponentFixture<DetFormaPagamentoComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DetFormaPagamentoComponent],
        });
        fixture = TestBed.createComponent(DetFormaPagamentoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
