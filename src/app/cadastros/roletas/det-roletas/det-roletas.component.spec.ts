import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetRoletasComponent } from './det-roletas.component';

describe('DetRoletasComponent', () => {
	let component: DetRoletasComponent;
	let fixture: ComponentFixture<DetRoletasComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [DetRoletasComponent],
		});
		fixture = TestBed.createComponent(DetRoletasComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
