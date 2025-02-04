import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChancellorCandidateCardComponent } from './chancellor-candidate.card.component';

describe('CardComponent', () => {
  let component: ChancellorCandidateCardComponent;
  let fixture: ComponentFixture<ChancellorCandidateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChancellorCandidateCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChancellorCandidateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
