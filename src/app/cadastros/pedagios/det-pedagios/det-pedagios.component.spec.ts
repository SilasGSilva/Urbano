import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetPedagiosComponent } from './det-pedagios.component';

describe('DetPedagiosComponent', () => {
  let component: DetPedagiosComponent;
  let fixture: ComponentFixture<DetPedagiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetPedagiosComponent]
    });
    fixture = TestBed.createComponent(DetPedagiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
