import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoletasComponent } from './roletas.component';

describe('RoletasComponent', () => {
  let component: RoletasComponent;
  let fixture: ComponentFixture<RoletasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoletasComponent]
    });
    fixture = TestBed.createComponent(RoletasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
