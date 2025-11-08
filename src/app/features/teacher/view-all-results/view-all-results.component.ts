import { AfterViewInit, Component, ElementRef, OnInit, signal, viewChild, ViewChild } from '@angular/core';
import { ResultService } from '../../../services/result/result.service';
import { CommonModule } from '@angular/common';
import { CourseDetail, StudentGrade } from '../../../shared/models/shared.model';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { UtilService } from '../../../services/util/util.service';
import { ColumnSelectorDialogComponent } from '../../../shared/modal/column-selector-dialog/column-selector-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { StudentSelectorDialogComponent } from '../../../shared/modal/student-selector-dialog/student-selector-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ScoreDetailsDialogComponent, ScoreDetailsData } from '../../../shared/modal/score-details-dialog/score-details-dialog.component';
import { SUMMA_CUM_LAUDE } from '../../../shared/models/shared.constant';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';




@Component({
  selector: 'app-view-all-results',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatChipsModule,
    MatSliderModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './view-all-results.component.html',
  styleUrl: './view-all-results.component.scss'
})
export class ViewAllResultsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Data
  students: StudentGrade[] = [];
  allStudents: StudentGrade[] = []; // Keep original data for filtering
  courses: CourseDetail[] = [];

  // Material Table
  dataSource = new MatTableDataSource<StudentGrade>();
  displayedColumns: string[] = [];

  // UI State
  isMobileView = false;
  searchTerm: string = '';

  // Filters
  activeFilters = {
    gradeRange: { min: 0, max: 100 },
    passingSubjects: [] as string[],
    searchTerm: ''
  };

  // Available filter options
  availableSubjects: string[] = [];

  selectedStudentIds: string[] = [];
  isCustomStudentSelection: boolean = false;

  // Column Management
  allColumns: string[] = ['rank', 'studentName'];
  availableSubjectColumns: number[] = [];
  selectedSubjectColumns: number[] = [];

  // Fixed columns that cannot be customized
  fixedColumns = ['rank', 'studentName', 'average',];


  showMoreSubjects = false;
  showLoading = signal(true);

  constructor(private dialog: MatDialog,
    private resultService: ResultService,
    private utilService: UtilService,
    private router: Router) { }

  ngOnInit() {
    // this.initializeData();
    this.checkScreenSize();

    this.resultService.getCourses().subscribe(courses => {
      if (!courses || courses.length === 0) return;

      this.showLoading.set(false);

      this.courses = courses;
      this.initializeData();
    });

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;


    // Custom sorting for specific columns
    this.dataSource.sortingDataAccessor = (item: StudentGrade, property: string) => {

      switch (property) {
        case 'rank':
          return item.rank || 0;
        case 'studentName':
          return item.studentName.toLowerCase();
        case 'average':
          return item.average;
        default:
          // Handle subject columns
          if (this.courses.some(subject => subject.id === +property)) {
            return item.courses[property] || 0;
          }
          return (item as any)[property];
      }
    };
  }



  private initializeData() {

    // Initialize column management
    this.availableSubjectColumns = this.courses.map(subject => subject.id);

    // Start with first 8 courses selected by default
    this.selectedSubjectColumns = this.availableSubjectColumns.slice(0, 8);

    // Build all columns and displayed columns
    this.updateDisplayedColumns();


    this.resultService.getStudents().subscribe(students => {
      this.students = students;
      this.allStudents = [...students];

      // Start with all students selected by default
      this.selectedStudentIds = students.map(student => student.studentId);
      this.isCustomStudentSelection = false;

      this.applyStudentSelection();
    });
  }


  applySearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.activeFilters.searchTerm = filterValue.trim().toLowerCase();
    this.applyAllFilters();
  }

  clearSearch() {
    this.activeFilters.searchTerm = '';
    this.searchTerm = '';
    this.applyAllFilters();
  }

  onGradeRangeChange(min: number, max: number) {
    this.activeFilters.gradeRange = { min, max };
    this.applyAllFilters();
  }

  onSubjectFilterChange(subjectId: number, isPassing: boolean) {
    if (isPassing) {
      if (!this.activeFilters.passingSubjects.includes(subjectId.toString())) {
        this.activeFilters.passingSubjects.push(subjectId.toString());
      }
    } else {
      this.activeFilters.passingSubjects = this.activeFilters.passingSubjects.filter(id => id !== subjectId.toString());
    }
    this.applyAllFilters();
  }

  clearAllFilters() {
    this.activeFilters = {
      gradeRange: { min: 0, max: 100 },
      passingSubjects: [],
      searchTerm: ''
    };
    this.searchTerm = '';
    this.clearStudentSelection();
    this.applyAllFilters();

  }

  // MAIN FILTERING LOGIC
  private applyAllFilters() {
    let filteredData = [...this.dataSource.data];

    // Apply search filter
    if (this.activeFilters.searchTerm) {
      filteredData = filteredData.filter(student =>
        student.studentName.toLowerCase().includes(this.activeFilters.searchTerm) ||
        student.studentId.toLowerCase().includes(this.activeFilters.searchTerm)
      );
    }


    // Apply grade range filter
    filteredData = filteredData.filter(student =>
      this.getStudentAverage(student) >= this.activeFilters.gradeRange.min &&
      this.getStudentAverage(student) <= this.activeFilters.gradeRange.max
    );

    // Apply subject passing filter
    if (this.activeFilters.passingSubjects.length > 0) {
      filteredData = filteredData.filter(student =>
        this.activeFilters.passingSubjects.every(subjectId =>
          student.courses[subjectId].score >= SUMMA_CUM_LAUDE
        )
      );
    }

    console.log("file", filteredData);
    

    this.dataSource.data = filteredData;

    // Reset paginator to first page after filtering
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  // STATISTICS METHODS
  getTopStudentsCount(): number {
    if (!this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
      return 0;
    }

    return this.dataSource.filteredData.filter(student =>

      this.calculateGradeFromAverage(student.average) === 'A+'
    ).length;
  }

  private calculateGradeFromAverage(average: number): string {
    if (average >= 97) return 'A+';
    if (average >= 93) return 'A';
    if (average >= 90) return 'A-';
    if (average >= 87) return 'B+';
    if (average >= 83) return 'B';
    if (average >= 80) return 'B-';
    if (average >= 77) return 'C+';
    if (average >= 73) return 'C';
    if (average >= 70) return 'C-';
    if (average >= 67) return 'D+';
    if (average >= 63) return 'D';
    if (average >= 60) return 'D-';
    return 'F';
  }

  getClassAverage(): number {
    const data = this.dataSource.filteredData as StudentGrade[];
    if (!data || data.length === 0) return 0;
    const total = data.reduce((sum, student) => sum + student.average, 0);
    return Number((total / data.length).toFixed(1));
  }

  getPassRate(): number {
    const data = this.dataSource.filteredData as StudentGrade[];
    if (!data || data.length === 0) return 0;
    const passingStudents = data.filter(student => student.average >= 60);
    return Number(((passingStudents.length / data.length) * 100).toFixed(1));
  }

  getTotalStudents(): number {
    return this.dataSource.filteredData.length;
  }

  // FILTER STATUS METHODS
  getActiveFilterCount(): number {
    let count = 0;
    if (this.activeFilters.searchTerm) count++;
    if (this.activeFilters.gradeRange.min > 0 || this.activeFilters.gradeRange.max < 100) count++;
    if (this.activeFilters.passingSubjects.length > 0) count++;
    if (this.isCustomStudentSelection) count++; // NEW: Count student selection as a filter

    return count;
  }

  isFilterActive(): boolean {
    return this.getActiveFilterCount() > 0;
  }


  getGradeValue(courses: {
    [subjectId: string]: {
      score: number;
      grade: string;
    };
  }, subId: number): string {
    if (courses[subId]) {
      return courses[subId].score.toString();

    }

    return '-'
  }


  getGradeColor(courses: {
    [subjectId: string]: {
      score: number;
      grade: string;
    };
  }, subId: number): string {
    const grade = courses[subId];
    if (grade) {
      if (grade.score >= 85) return 'grade-excellent';
      if (grade.score >= 70) return 'grade-average';
      return 'grade-poor';
    }else{
      return ""
    }

  }

  getSubjectGrade(student: StudentGrade, subjectId: string): number {
    return student.courses[subjectId].score;
  }

  getSubjectName(subjectId: number): string {
    const subject = this.courses.find(s => s.id === subjectId);
    return subject ? subject.code : `${subjectId}`;
  }


  isSubjectSelected(subjectId: number): boolean {
    return this.activeFilters.passingSubjects.includes(subjectId.toString());
  }

  exportResults() {
    const csv = this.resultService.exportToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student-grades-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  private checkScreenSize() {
    if (this.utilService.isBrowser) {
      this.isMobileView = window.innerWidth < 1024;
    }
  }


  // COLUMN MANAGEMENT
  updateDisplayedColumns() {
    this.displayedColumns = [
      'rank',
      'studentName',
      ...this.selectedSubjectColumns.map(col => col.toString()),
      'average',
    ];
  }

  openStudentSelector() {
    const dialogRef = this.dialog.open(StudentSelectorDialogComponent, {
      width: '1000px',
      height: '600px',
      data: {
        students: this.allStudents,
        selectedStudentIds: [...this.selectedStudentIds],
        isCustomSelection: this.isCustomStudentSelection
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedStudentIds = result.selectedStudentIds;
        this.isCustomStudentSelection = result.isCustomSelection;
        this.applyStudentSelection();
      }
    });
  }

  applyStudentSelection() {
    if (this.isCustomStudentSelection && this.selectedStudentIds.length > 0) {
      // Show only selected students
      const selectedStudents = this.allStudents.filter(student =>
        this.selectedStudentIds.includes(student.studentId)
      );

      this.dataSource.data = selectedStudents;
    } else {
      // Show all students (respecting other filters)
      this.dataSource.data = [...this.allStudents];
    }

    // Apply other active filters
    this.applyAllFilters();
  }


  // Calculate dynamic average based on visible subject columns
  calculateDynamicAverage(student: StudentGrade): number {
    if (this.selectedSubjectColumns.length === 0) {
      return student.average; // Fallback to original average
    }

    const visibleGrades = this.selectedSubjectColumns.map(subjectId =>
      student.courses[subjectId]?.score || 0
    );

    const sum = visibleGrades.reduce((total, grade) => total + grade, 0);
    return Number((sum / visibleGrades.length).toFixed(1));
  }

  // Get student's average for display (uses dynamic calculation)
  getStudentAverage(student: StudentGrade): number {
    return this.calculateDynamicAverage(student);
  }

  // COLUMN SELECTOR FUNCTIONALITY
  openColumnSelector() {
    const dialogRef = this.dialog.open(ColumnSelectorDialogComponent, {
      width: '600px',
      data: {
        courses: this.courses,
        selectedColumns: [...this.selectedSubjectColumns],
        availableColumns: this.availableSubjectColumns
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedSubjectColumns = result;
        this.updateDisplayedColumns();

        // Refresh data to recalculate averages
        this.dataSource.data = [...this.dataSource.data];
      }
    });
  }

  toggleSubjectColumn(subjectId: number) {
    const index = this.selectedSubjectColumns.indexOf(subjectId);
    if (index > -1) {
      // Remove column
      this.selectedSubjectColumns.splice(index, 1);
    } else {
      // Add column
      this.selectedSubjectColumns.push(subjectId);
    }
    this.updateDisplayedColumns();

    // Refresh data to recalculate averages
    this.dataSource.data = [...this.dataSource.data];
  }

  isSubjectColumnVisible(subjectId: string): boolean {
    return this.selectedSubjectColumns.includes(+subjectId);
  }

  getVisibleSubjectCount(): number {
    return this.selectedSubjectColumns.length;
  }

  getHiddenSubjectCount(): number {
    return this.availableSubjectColumns.length - this.selectedSubjectColumns.length;
  }

  toggleShowMoreSubjects() {
    this.showMoreSubjects = !this.showMoreSubjects;
  }

  getSelectedStudentCount(): number {
    if (!this.isCustomStudentSelection) {
      return this.allStudents.length;
    }
    return this.selectedStudentIds.length;
  }

  getStudentSelectionText(): string {
    if (!this.isCustomStudentSelection) {
      return 'All Students';
    }
    return `${this.selectedStudentIds.length} Selected`;
  }

  clearStudentSelection() {
    this.selectedStudentIds = this.allStudents.map(student => student.studentId);
    this.isCustomStudentSelection = false;
    this.applyStudentSelection();
  }

  // Get courses for display in the quick selector
  getDisplaySubjects(): CourseDetail[] {
    const visibleSubjects = this.courses.filter(subject =>
      this.selectedSubjectColumns.includes(subject.id)
    );

    if (this.showMoreSubjects) {
      return visibleSubjects;
    } else {
      return visibleSubjects.slice(0, 8);
    }
  }

  // Get courses available for selection (not currently visible)
  getAvailableSubjects(): CourseDetail[] {
    return this.courses.filter(subject =>
      !this.selectedSubjectColumns.includes(subject.id)
    );
  }


  enterNewResult() {
    this.router.navigate(['/teacher/results/entry']);
  }

  openScoreDetails(student: StudentGrade, subjectId: number, event: Event) {
    event.stopPropagation(); // Prevent row click events

    const subject = this.courses.find(s => s.id === +subjectId);
    if (!subject) return;

    const score = student.courses[subjectId];

    const dialogRef = this.dialog.open(ScoreDetailsDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        student: student,
        subjectId: subjectId.toString(),
        subject: subject,
        grade: score
      } as ScoreDetailsData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'view-report') {
        // Navigate to full student report page
        // this.router.navigate(['/student-report', student.studentId]);
      }
    });
  }

  // Add this method for mobile card view
  openMobileScoreDetails(student: StudentGrade, subjectId: number) {
    const subject = this.courses.find(s => s.id === +subjectId);
    if (!subject) return;

    const score = student.courses[subjectId];

    const dialogRef = this.dialog.open(ScoreDetailsDialogComponent, {
      width: '95vw',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        student: student,
        subjectId: subjectId.toString(),
        subject: subject,
        grade: score
      } as ScoreDetailsData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'view-report') {
        // Navigate to full student report page
        // this.router.navigate(['/student-report', student.studentId]);
      }
    });
  }



}
