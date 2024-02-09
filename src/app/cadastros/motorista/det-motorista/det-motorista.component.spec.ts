import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetMotoristaComponent } from './det-motorista.component';

describe('DetMotoristaComponent', () => {
    let component: DetMotoristaComponent;
    let fixture: ComponentFixture<DetMotoristaComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DetMotoristaComponent],
        });
        fixture = TestBed.createComponent(DetMotoristaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
