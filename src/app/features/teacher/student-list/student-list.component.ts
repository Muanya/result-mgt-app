import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'graduated';
  grade: string;
  avatar?: string;
  address: string;
  dateOfBirth: Date;
  guardianName: string;
  guardianPhone: string;
}


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
    MatCheckboxModule
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
    'course',
    'enrollmentDate',
    'status',
    'grade',
    'actions'
  ];

  dataSource: MatTableDataSource<Student>;
  selection = new SelectionModel<Student>(true, []);
  filterForm: FormGroup;
  showFilterPanel = false;

  // Sample data
  students: Student[] = [
    {
      id: 'STU001',
      name: 'John Smith',
      email: 'john.smith@university.edu',
      phone: '+1 (555) 123-4567',
      course: 'Computer Science',
      enrollmentDate: new Date('2022-09-01'),
      status: 'active',
      grade: 'A',
      avatar: 'JS',
      address: '123 Main St, Boston, MA',
      dateOfBirth: new Date('2000-05-15'),
      guardianName: 'Robert Smith',
      guardianPhone: '+1 (555) 987-6543'
    },
    {
      id: 'STU002',
      name: 'Sarah Johnson',
      email: 'sarah.j@university.edu',
      phone: '+1 (555) 234-5678',
      course: 'Mathematics',
      enrollmentDate: new Date('2022-09-01'),
      status: 'active',
      grade: 'A-',
      avatar: 'SJ',
      address: '456 Oak Ave, Cambridge, MA',
      dateOfBirth: new Date('2001-03-22'),
      guardianName: 'Michael Johnson',
      guardianPhone: '+1 (555) 876-5432'
    },
    {
      id: 'STU003',
      name: 'Michael Brown',
      email: 'm.brown@university.edu',
      phone: '+1 (555) 345-6789',
      course: 'Physics',
      enrollmentDate: new Date('2021-09-01'),
      status: 'graduated',
      grade: 'B+',
      avatar: 'MB',
      address: '789 Pine Rd, Newton, MA',
      dateOfBirth: new Date('1999-11-30'),
      guardianName: 'David Brown',
      guardianPhone: '+1 (555) 765-4321'
    },
    {
      id: 'STU004',
      name: 'Emily Davis',
      email: 'emily.davis@university.edu',
      phone: '+1 (555) 456-7890',
      course: 'Biology',
      enrollmentDate: new Date('2023-01-15'),
      status: 'active',
      grade: 'A',
      avatar: 'ED',
      address: '321 Elm St, Quincy, MA',
      dateOfBirth: new Date('2002-07-18'),
      guardianName: 'James Davis',
      guardianPhone: '+1 (555) 654-3210'
    },
    {
      id: 'STU005',
      name: 'David Wilson',
      email: 'd.wilson@university.edu',
      phone: '+1 (555) 567-8901',
      course: 'Chemistry',
      enrollmentDate: new Date('2022-09-01'),
      status: 'inactive',
      grade: 'C+',
      avatar: 'DW',
      address: '654 Maple Dr, Brookline, MA',
      dateOfBirth: new Date('2000-12-05'),
      guardianName: 'Richard Wilson',
      guardianPhone: '+1 (555) 543-2109'
    },
    {
      id: 'STU006',
      name: 'Jennifer Lee',
      email: 'j.lee@university.edu',
      phone: '+1 (555) 678-9012',
      course: 'Computer Science',
      enrollmentDate: new Date('2023-01-15'),
      status: 'active',
      grade: 'A-',
      avatar: 'JL',
      address: '987 Cedar Ln, Somerville, MA',
      dateOfBirth: new Date('2001-09-12'),
      guardianName: 'Thomas Lee',
      guardianPhone: '+1 (555) 432-1098'
    }
  ];

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
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource(this.students);
    this.filterForm = this.createFilterForm();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createFilterForm(): FormGroup {
    return this.fb.group({
      name: [''],
      course: [''],
      status: [''],
      grade: [''],
      dateRange: this.fb.group({
        start: [''],
        end: ['']
      })
    });
  }

  applyFilter() {
    const filters = this.filterForm.value;

    this.dataSource.filterPredicate = (data: Student, filter: string) => {
      const filterObj = JSON.parse(filter);
      const nameMatch = !filterObj.name ||
        data.name.toLowerCase().includes(filterObj.name.toLowerCase());
      const courseMatch = !filterObj.course || data.course === filterObj.course;
      const statusMatch = !filterObj.status || data.status === filterObj.status;
      const gradeMatch = !filterObj.grade || data.grade === filterObj.grade;

      return nameMatch && courseMatch && statusMatch && gradeMatch;
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
  }

  editStudent(student: Student) {
    // Implement edit student dialog
    console.log('Edit student:', student);
  }

  viewStudent(student: Student) {
    // Implement view student details
    console.log('View student:', student);
  }

  deleteStudent(student: Student) {
    // Implement delete confirmation
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      const index = this.dataSource.data.findIndex(s => s.id === student.id);
      if (index > -1) {
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }
    }
  }

  deleteSelected() {
    const selectedNames = this.selection.selected.map(s => s.name).join(', ');
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
