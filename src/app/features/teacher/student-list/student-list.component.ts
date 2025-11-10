import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChip } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { Observable, take, map } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { UserDetail } from '../../../shared/models/shared.model';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-student-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatSort,
    MatIcon,
    MatChip,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'select',
    'name',
    'email',
    'phone',
    'enrollmentDate',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<UserDetail>([]);
  selection = new SelectionModel<UserDetail>(true, []);
  filterForm: FormGroup;
  showFilterPanel = false;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  // Sample data
  students: UserDetail[] = [];

  courses = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Biology',
    'Chemistry',
    'Engineering',
    'Business Administration'
  ];

  statuses = [
    { value: 'active', label: 'Active', color: 'primary' },
    { value: 'inactive', label: 'Inactive', color: 'warn' },
    { value: 'graduated', label: 'Graduated', color: 'accent' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private apiService: ApiService,
    private router: Router
  ) {
    // this.dataSource = new MatTableDataSource(this.students);
    this.filterForm = this.createFilterForm();
  }

  ngOnInit(): void {
    this.fetchStudents();

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // React to sort changes
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.pageIndex = 0; // reset page on sort
      this.fetchStudents();
    });

    // React to pagination
    this.paginator.page.subscribe((event: PageEvent) => {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.fetchStudents();
    });
  }


  fetchStudents(): void {
    const search = this.filterForm.get('search')?.value || '';
    const sortActive = this.sort?.active || 'name';
    const sortDirection = this.sort?.direction || 'asc';

    this.loadStudents(this.pageIndex, this.pageSize, search, sortActive, sortDirection)
      .subscribe(students => {
        this.students = students;
        this.dataSource.data = this.students;
        this.totalItems = students.length;
      });
  }

  loadStudents(page = 0, size = 20,
    search = '',
    sortBy = 'name',
    sortDir: 'asc' | 'desc' = 'asc'): Observable<UserDetail[]> {
    return this.apiService.getAllStudents().pipe(
      take(1),
      map(res => res.map((data: { firstName: any; lastName: any; email: any; }) =>
      ({
        firstName: data.firstName, lastName: data.lastName, email: data.email, phone: '+1 (555) 678-9012',
        enrollmentDate: new Date('2023-01-15'),
        status: 'active',
        avatar: `${data.firstName.charAt(0)}${data.lastName.charAt(0)}  `,
        dateOfBirth: new Date('2001-09-12'),
      } as UserDetail)
      ))
    );

  }


  createFilterForm(): FormGroup {
    return this.fb.group({
      name: [''],
      status: [''],
      dateRange: this.fb.group({
        start: [''],
        end: ['']
      })
    });
  }

  applyFilter() {
    const filters = this.filterForm.value;

    this.dataSource.filterPredicate = (data: UserDetail, filter: string) => {
      const filterObj = JSON.parse(filter);
      const nameMatch = !filterObj.name ||
        data.firstName.toLowerCase().includes(filterObj.name.toLowerCase());
      const statusMatch = !filterObj.status || data.status === filterObj.status;

      return nameMatch && statusMatch;
    };

    this.dataSource.filter = JSON.stringify(filters);
  }

  clearFilters() {
    this.filterForm.reset();
    this.applyFilter();
  }

  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
  }

  // Selection methods
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  // Action methods
  addStudent() {
    // Implement add student dialog
    console.log('Add student clicked');
    this.router.navigate(['/teacher/students/add']);
  }

  editStudent(student: UserDetail) {
    // Implement edit student dialog
    console.log('Edit student:', student);
  }

  viewStudent(student: UserDetail) {
    // Implement view student details
    console.log('View student:', student);
  }

  deleteStudent(student: UserDetail) {
    // Implement delete confirmation
    if (confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      const index = this.dataSource.data.findIndex(s => s.id === student.id);
      if (index > -1) {
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }
    }
  }

  deleteSelected() {
    const selectedNames = this.selection.selected.map(s => s.firstName).join(', ');
    if (confirm(`Are you sure you want to delete ${selectedNames}?`)) {
      this.dataSource.data = this.dataSource.data.filter(
        student => !this.selection.isSelected(student)
      );
      this.selection.clear();
    }
  }

  exportStudents() {
    // Implement export functionality
    console.log('Export students');
  }

  getStatusColor(status: string): string {
    const statusObj = this.statuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'default';
  }

  getStatusLabel(status: string): string {
    const statusObj = this.statuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  }

  getAvatarColor(name: string): string {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }
}
