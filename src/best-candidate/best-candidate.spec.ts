import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestCandidate } from './best-candidate';

describe('BestCandidate', () => {
  let component: BestCandidate;
  let fixture: ComponentFixture<BestCandidate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestCandidate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestCandidate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
