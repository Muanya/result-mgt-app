import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatOptionModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable, take, map, switchMap } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavItem } from '../../../shared/models/shared.model';


export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: string;
  nationality: string;
  identificationNumber: string;
  avatar?: string;

  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };



  academicInfo: StudentAcademicInfo;

}

export interface Grade {
  subject: string;
  code: string;
  credits: number;
  grade: string;
  points: number;
  enrollment: string;
  year: number;
}

export interface AttendanceRecord {
  date: Date;
  subject: string;
  status: 'Present' | 'Absent' | 'Late';
  notes?: string;
}

export interface StudentAcademicInfo {
  courseId: string;
  courseName: string;
  enrollmentDate: Date;
  enrollmentStatus: 'Active' | 'Inactive' | 'Graduated' | 'Suspended';
  currentEnrollment: string;
  studentId: string;

}

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatTableModule,
    MatOptionModule,
    MatTabsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
]
})
export class StudentDetailComponent implements OnInit {
  student$!: Observable<any>;
  studentDetail: Student | null = null;
  editForm: FormGroup;
  isEditing = false;
  selectedTab = 0;

  // Sample data
  grades: Grade[] = [
    { subject: 'Mathematics', code: 'MATH101', credits: 4, grade: 'A', points: 4.0, enrollment: "personal", year: 2023 },
    { subject: 'Computer Programming', code: 'CS101', credits: 3, grade: 'A-', points: 3.7, enrollment: "personal", year: 2023 },
    { subject: 'Physics', code: 'PHY101', credits: 4, grade: 'B+', points: 3.3, enrollment: "personal", year: 2023 },
    { subject: 'Data Structures', code: 'CS201', credits: 3, grade: 'A', points: 4.0, enrollment: "personal", year: 2023 },
    { subject: 'Algorithms', code: 'CS202', credits: 3, grade: 'B+', points: 3.3, enrollment: "personal", year: 2023 }
  ];

  attendance: AttendanceRecord[] = [
    { date: new Date('2024-01-15'), subject: 'Mathematics', status: 'Present' },
    { date: new Date('2024-01-16'), subject: 'Computer Programming', status: 'Present' },
    { date: new Date('2024-01-17'), subject: 'Physics', status: 'Late', notes: '15 minutes late' },
    { date: new Date('2024-01-18'), subject: 'Data Structures', status: 'Absent', notes: 'Medical leave' },
    { date: new Date('2024-01-19'), subject: 'Algorithms', status: 'Present' }
  ];


  activities = [
    { date: new Date('2024-01-10'), activity: 'Registered for Spring 2024 courses', type: 'academic' },
    { date: new Date('2024-01-05'), activity: 'Updated contact information', type: 'profile' },
    { date: new Date('2023-12-20'), activity: 'Submitted final project', type: 'academic' },
    { date: new Date('2023-12-15'), activity: 'Participated in Science Fair', type: 'extra' }
  ];

  
  menu: NavItem[] = [
    { label: 'Profile', children: [
      { label: 'Logout', action: ()=> this.logout() },
    ] },

  ];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
  ) {
    this.editForm = this.createEditForm();
  }

  ngOnInit() {
    this.loadStudentData();
  }


  loadStudentData() {

    this.student$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id')) || 1),
      switchMap(id => this.apiService.getStudentById(id)),
      map(students => {
        this.studentDetail = {
          id: students.id,
          firstName: students.firstName,
          lastName: students.lastName,
          email: students.email,
          phone: '+1 (555) 123-4567',
          dateOfBirth: new Date('1993-12-15'),
          gender: 'Male',
          nationality: 'Nigerian',
          identificationNumber: 'PASS123456',
          avatar: students.firstName.charAt(0) + students.lastName.charAt(0),
          academicInfo: this.loadAcademicData(),
          address: this.loadAddressData()
        };

        console.log("student ", this.studentDetail);

        return this.studentDetail;
      })
    );

    this.student$.subscribe(student => {
      this.populateForm();

    });

  }



  loadAcademicData(): StudentAcademicInfo {
    // Load academic data from API if needed
    return {
      courseId: 'CS101',
      courseName: 'Computer Science',
      enrollmentDate: new Date('2022-09-01'),
      enrollmentStatus: 'Active',
      currentEnrollment: "personal",
      studentId: 'STUCS2022001'
    };
  }

  loadAddressData() {
    // Load address from API if needed
    return {
      street: '123 Main Street',
      city: 'Lekki',
      state: 'Lagos',
      zipCode: '10126',
      country: 'Nigeria'
    };
  }

  createEditForm(): FormGroup {
    return this.fb.group({
      personalInfo: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        gender: ['', Validators.required],
        bloodGroup: [''],
        nationality: ['', Validators.required]
      }),

      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required],
        country: ['', Validators.required]
      }),



      academicInfo: this.fb.group({
        enrollmentStatus: ['', Validators.required],
        currentSemester: ['', [Validators.required, Validators.min(1)]]
      })
    });
  }

  populateForm() {
    if (this.studentDetail) {
      this.editForm.patchValue({
        personalInfo: {
          firstName: this.studentDetail.firstName,
          lastName: this.studentDetail.lastName,
          email: this.studentDetail.email,
          phone: this.studentDetail.phone,
          dateOfBirth: this.studentDetail.dateOfBirth,
          gender: this.studentDetail.gender,
          nationality: this.studentDetail.nationality
        },
        address: this.studentDetail.address,
        academicInfo: {
          enrollmentStatus: this.studentDetail.academicInfo.enrollmentStatus,
          currentEnrollment: this.studentDetail.academicInfo.currentEnrollment
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }

  editStudent() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.populateForm();
  }

  saveStudent() {
    if (this.editForm.valid && this.studentDetail) {
      const formValue = this.editForm.value;

      // Update student object
      this.studentDetail = {
        ...this.studentDetail,
        firstName: formValue.personalInfo.firstName,
        lastName: formValue.personalInfo.lastName,
        email: formValue.personalInfo.email,
        phone: formValue.personalInfo.phone,
        dateOfBirth: formValue.personalInfo.dateOfBirth,
        gender: formValue.personalInfo.gender,
        nationality: formValue.personalInfo.nationality,
        address: formValue.address,
        academicInfo: {
          ...this.studentDetail.academicInfo,
          enrollmentStatus: formValue.academicInfo.enrollmentStatus,
          currentEnrollment: formValue.academicInfo.currentEnrollment
        }
      };

      this.isEditing = false;

      this.snackBar.open('Student information updated successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
  }

  // Utility methods
  calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  getAcademicProgress(): number {
    // total courses done / total courses
    if (!this.studentDetail) return 0;
    return 50; // Placeholder value
  }

  getGPA(): number {
    const totalPoints = this.grades.reduce((sum, grade) => sum + grade.points * grade.credits, 0);
    const totalCredits = this.grades.reduce((sum, grade) => sum + grade.credits, 0);
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }

  getAttendancePercentage(): number {
    const totalClasses = this.attendance.length;
    const presentClasses = this.attendance.filter(a => a.status === 'Present').length;
    return totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;
  }




  getAvatarColor(name: string): string {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active': return 'primary';
      case 'Paid': return 'primary';
      case 'Present': return 'primary';
      case 'Pending': return 'accent';
      case 'Late': return 'accent';
      case 'Overdue': return 'warn';
      case 'Absent': return 'warn';
      case 'Inactive': return 'warn';
      case 'Graduated': return 'success';
      default: return 'default';
    }
  }

  printStudentInfo() {
    window.print();
  }

  sendMessage() {
    console.log('Send message to:', this.studentDetail?.email);
  }

  viewAcademicRecord() {
    this.selectedTab = 1;
  }

  viewAttendance() {
    this.selectedTab = 2; 
  }

  getTotalCredits(): number {
    return this.grades?.reduce((sum, grade) => sum + grade.credits, 0) || 0;
  }

  // Form getters for template
  get personalInfo() {
    return this.editForm.get('personalInfo');
  }

  get address() {
    return this.editForm.get('address');
  }

  get emergencyContact() {
    return this.editForm.get('emergencyContact');
  }

  get academicInfo() {
    return this.editForm.get('academicInfo');
  }

 logout(): void {
  console.log("called here");
  
  this.apiService.logout().pipe(take(1)).subscribe({
    next: (response) => {
      console.log('Logout successful:', response);
      // Redirect to login page or perform other actions
      window.location.href = '/public/';
    }
  });
}
}


