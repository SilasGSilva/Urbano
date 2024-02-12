import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalidadesComponent } from './localidades.component';

describe('LocalidadeComponent', () => {
	let component: LocalidadesComponent;
	let fixture: ComponentFixture<LocalidadesComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [LocalidadesComponent],
		});
		fixture = TestBed.createComponent(LocalidadesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
