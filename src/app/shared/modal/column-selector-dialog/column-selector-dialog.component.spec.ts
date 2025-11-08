import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnSelectorDialogComponent } from './column-selector-dialog.component';

describe('ColumnSelectorDialogComponent', () => {
  let component: ColumnSelectorDialogComponent;
  let fixture: ComponentFixture<ColumnSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnSelectorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
