import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentWithResultDialogComponent } from './add-student-with-result-dialog.component';

describe('AddStudentWithResultDialogComponent', () => {
  let component: AddStudentWithResultDialogComponent;
  let fixture: ComponentFixture<AddStudentWithResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStudentWithResultDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStudentWithResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
