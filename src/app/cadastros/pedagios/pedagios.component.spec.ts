import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedagiosComponent } from './pedagios.component';

describe('PedagiosComponent', () => {
  let component: PedagiosComponent;
  let fixture: ComponentFixture<PedagiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PedagiosComponent]
    });
    fixture = TestBed.createComponent(PedagiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
