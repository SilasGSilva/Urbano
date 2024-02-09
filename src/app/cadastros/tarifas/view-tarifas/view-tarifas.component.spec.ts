import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTarifasComponent } from './view-tarifas.component';

describe('ViewTarifasComponent', () => {
    let component: ViewTarifasComponent;
    let fixture: ComponentFixture<ViewTarifasComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ViewTarifasComponent],
        });
        fixture = TestBed.createComponent(ViewTarifasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
