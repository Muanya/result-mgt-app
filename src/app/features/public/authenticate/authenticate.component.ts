import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGoogle, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { take } from 'rxjs';

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
  faFacebook = faFacebookF;
  faGoogle = faGoogle;
  faLinkedIn = faLinkedin

  hidePassword = true;



  // Login data model
  loginData = {
    email: '',
    password: '',
    remember: false
  };

  // Register data model
  registerData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  };



  constructor(private authService: AuthService) { }
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

    this.authService.login(this.loginData.email, this.loginData.password).pipe(take(1)).subscribe(result => {
      console.log('Login successful:', result);
      alert('Login successful!');
    })
  };

  // Register function
  register() {
    console.log('Register data:', this.registerData);

    // Check if passwords match
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }


  };
}
