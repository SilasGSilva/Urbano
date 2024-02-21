import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFrotasComponent } from './view-frotas.component';

describe('ViewFrotasComponent', () => {
  let component: ViewFrotasComponent;
  let fixture: ComponentFixture<ViewFrotasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewFrotasComponent]
    });
    fixture = TestBed.createComponent(ViewFrotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
