import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetLinhaComponent } from './det-linha.component';

describe('DetLinhaComponent', () => {
  let component: DetLinhaComponent;
  let fixture: ComponentFixture<DetLinhaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetLinhaComponent]
    });
    fixture = TestBed.createComponent(DetLinhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
