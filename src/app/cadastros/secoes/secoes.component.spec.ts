import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecoesComponent } from './secoes.component';

describe('SecoesComponent', () => {
	let component: SecoesComponent;
	let fixture: ComponentFixture<SecoesComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [SecoesComponent],
		});
		fixture = TestBed.createComponent(SecoesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
