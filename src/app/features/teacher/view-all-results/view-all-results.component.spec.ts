import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllResultsComponent } from './view-all-results.component';

describe('ViewAllResultsComponent', () => {
  let component: ViewAllResultsComponent;
  let fixture: ComponentFixture<ViewAllResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
