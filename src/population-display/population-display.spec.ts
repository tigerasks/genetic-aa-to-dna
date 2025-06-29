import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopulationDisplay } from './population-display';

describe('CandidatesList', () => {
  let component: PopulationDisplay;
  let fixture: ComponentFixture<PopulationDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopulationDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopulationDisplay);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
