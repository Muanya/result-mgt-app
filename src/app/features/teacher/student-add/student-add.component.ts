import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
}


@Component({
  selector: 'app-student-add',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatStepperModule,
    MatDatepickerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './student-add.component.html',
  styleUrl: './student-add.component.scss'
})
export class StudentAddComponent {
  studentForm!: FormGroup;
  isSubmitting = false;
  currentStep = 1;
  totalSteps = 3;

  courses: Course[] = [
    { id: 'CS101', name: 'Computer Science', duration: '4 years', fees: 12000 },
    { id: 'MA101', name: 'Mathematics', duration: '3 years', fees: 10000 },
    { id: 'PH101', name: 'Physics', duration: '4 years', fees: 11000 },
    { id: 'BI101', name: 'Biology', duration: '4 years', fees: 11500 },
    { id: 'CH101', name: 'Chemistry', duration: '3 years', fees: 10500 },
    { id: 'EN101', name: 'Engineering', duration: '4 years', fees: 13000 },
    { id: 'BA101', name: 'Business Administration', duration: '3 years', fees: 9500 }
  ];
  genders = ['Male'];
  enrollmentStatuses = ['Active', 'Pending', 'Conditional'];
  generatedStudentId?: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.studentForm = this.createStudentForm();
  }

  createStudentForm(): FormGroup {
    return this.fb.group({
      // Personal Information
      personalInfo: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        dateOfBirth: ['', [Validators.required, this.ageValidator]],
        gender: ['', Validators.required],
        nationality: ['Nigeria', Validators.required],
      }),

      // Contact Information
      contactInfo: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]{10,}$/)]],
      }),

    });
  }


  generateEmail() {
    const firstName = this.personalInfo.get('firstName')?.value;
    const lastName = this.personalInfo.get('lastName')?.value;

    if (firstName && lastName && !this.contactInfo.get('email')?.value) {
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@university.edu`;
      this.contactInfo.get('email')?.setValue(email);
    }
  }

  generateStudentId(courseId: string) {
    // In a real application, this would call a service to generate a unique ID
    const timestamp = new Date().getTime().toString().slice(-4);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const studentId = `STU${courseId}${timestamp}${random}`;

    // Store generated ID for display (not in form)
    this.generatedStudentId = studentId;
  }

  // Form getters for easier access
  get personalInfo(): FormGroup {
    return this.studentForm.get('personalInfo') as FormGroup;
  }

  get contactInfo(): FormGroup {
    return this.studentForm.get('contactInfo') as FormGroup;
  }

  get academicInfo(): FormGroup {
    return this.studentForm.get('academicInfo') as FormGroup;
  }

  get address(): FormGroup {
    return this.contactInfo.get('address') as FormGroup;
  }

  get emergencyContact(): FormGroup {
    return this.contactInfo.get('emergencyContact') as FormGroup;
  }



  // Custom Validators
  ageValidator(control: AbstractControl) {
    if (!control.value) return null;

    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 16 && age <= 60 ? null : { invalidAge: true };
  }

  // Step Navigation
  nextStep() {
    console.log(this.currentStep, this.isCurrentStepValid(), "===", this.contactInfo.errors);

    if (this.isCurrentStepValid()) {
      this.currentStep++;
      this.scrollToTop();
    } else {
      this.markCurrentStepAsTouched();
    }
  }

  previousStep() {
    this.currentStep--;
    this.scrollToTop();
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.personalInfo.valid;
      case 2:
        return this.contactInfo.valid;
      default:
        return false;
    }
  }

  markCurrentStepAsTouched() {
    switch (this.currentStep) {
      case 1:
        this.markFormGroupAsTouched(this.personalInfo);
        break;
      case 2:
        this.markFormGroupAsTouched(this.contactInfo);
        break;
    }
  }

  markFormGroupAsTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupAsTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Form Submission
  onSubmit() {
    if (this.studentForm.valid) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        const formData = this.studentForm.value;

        // In real application, you would send this to your backend
        console.log('Student Data:', formData);

        this.isSubmitting = false;
        this.showSuccessMessage();
        this.router.navigate(['/students']);
      }, 2000);
    } else {
      this.markFormGroupAsTouched(this.studentForm);
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
  }

  showSuccessMessage() {
    this.snackBar.open('Student added successfully!', 'View Students', {
      duration: 5000,
      panelClass: ['success-snackbar']
    }).onAction().subscribe(() => {
      this.router.navigate(['/students']);
    });
  }

  onCancel() {
    if (this.studentForm.dirty) {
      if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        this.location.back();
      }
    } else {
      this.location.back();
    }
  }



  calculateAge(dateOfBirth: string): number {
    if (!dateOfBirth) return 0;

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  // Get today's date for max date in date pickers
  get today(): Date {
    return new Date();
  }

  get maxBirthDate(): Date {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 16);
    return date;
  }

  get minBirthDate(): Date {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 60);
    return date;
  }
}
