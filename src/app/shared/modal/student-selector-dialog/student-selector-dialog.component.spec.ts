import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSelectorDialogComponent } from './student-selector-dialog.component';

describe('StudentSelectorDialogComponent', () => {
  let component: StudentSelectorDialogComponent;
  let fixture: ComponentFixture<StudentSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSelectorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
