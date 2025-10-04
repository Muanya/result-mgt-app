import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { LoginData, RegisterData } from '../../../shared/models/shared.model';
import { UserRole } from '../../../shared/models/shared.enum';

@Component({
  selector: 'app-authenticate',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.scss'
})
export class AuthenticateComponent implements OnInit {
  // Initialize form state
  currentForm = 'login';
  animateForm = true;
  faCheckCircle = faCheckCircle;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  hidePassword = true;

  // Login data model
  loginData: LoginData = {
    email: '',
    password: '',
  };

  // Register data model
  registerData: RegisterData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.STUDENT,
  };



  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit() { }

  // Switch between login and register forms
  setForm(form: any) {
    this.currentForm = form;
    this.animateForm = false;
    // timeout(function () {
    //   this.animateForm = true;
    // }, 50);
  };

  // Toggle password visibility
  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  // Login function
  login(event: Event) {
    event.preventDefault();
    console.log('Login data:', this.loginData, this.loginData.email, this.loginData.password);

    this.authService.login(this.loginData).pipe(take(1)).subscribe(result => {
      console.log('Login successful:', result);
      const userRole = this.authService.getUserRole()

      if (userRole === UserRole.MAGISTER) {
        this.router.navigate(['/teacher/']);

      } else {
        this.router.navigate(['/student/']);

      }
    })
  };

  // Register function
  register(event: Event) {
    event.preventDefault();

    // Check if passwords match
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.authService.register(this.registerData).pipe(take(1)).subscribe(result => {
      console.log('Register successful:', result);
      const userRole = this.authService.getUserRole()

      if (userRole === UserRole.MAGISTER) {
        this.router.navigate(['/teacher/']);

      } else {
        this.router.navigate(['/student/']);
      }
    })


  };
}
