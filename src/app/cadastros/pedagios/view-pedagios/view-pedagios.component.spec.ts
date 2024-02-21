import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPedagiosComponent } from './view-pedagios.component';

describe('ViewPedagiosComponent', () => {
	let component: ViewPedagiosComponent;
	let fixture: ComponentFixture<ViewPedagiosComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ViewPedagiosComponent],
		});
		fixture = TestBed.createComponent(ViewPedagiosComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
