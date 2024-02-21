import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetFrotasComponent } from './det-frotas.component';

describe('DetFrotasComponent', () => {
  let component: DetFrotasComponent;
  let fixture: ComponentFixture<DetFrotasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetFrotasComponent]
    });
    fixture = TestBed.createComponent(DetFrotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
