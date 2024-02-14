import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLinhasComponent } from './view-linhas.component';

describe('ViewLinhasComponent', () => {
  let component: ViewLinhasComponent;
  let fixture: ComponentFixture<ViewLinhasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewLinhasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewLinhasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
