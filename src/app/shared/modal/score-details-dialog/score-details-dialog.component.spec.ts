import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreDetailsDialogComponent } from './score-details-dialog.component';

describe('ScoreDetailsDialogComponent', () => {
  let component: ScoreDetailsDialogComponent;
  let fixture: ComponentFixture<ScoreDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
