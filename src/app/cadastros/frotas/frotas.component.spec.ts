import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrotasComponent } from './frotas.component';

describe('FrotasComponent', () => {
  let component: FrotasComponent;
  let fixture: ComponentFixture<FrotasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrotasComponent]
    });
    fixture = TestBed.createComponent(FrotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
