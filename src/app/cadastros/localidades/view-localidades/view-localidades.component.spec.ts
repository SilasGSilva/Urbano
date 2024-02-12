import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLocalidadesComponent } from './view-localidades.component';

describe('ViewLocalidadesComponent', () => {
	let component: ViewLocalidadesComponent;
	let fixture: ComponentFixture<ViewLocalidadesComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ViewLocalidadesComponent],
		});
		fixture = TestBed.createComponent(ViewLocalidadesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
