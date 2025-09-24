import e from "express";

export interface Student {
  id?: number;
  admissionNo: string;
  firstName: string;
  lastName?: string;
  dob?: string; // ISO date
  classId?: number;
  gender?: 'M' | 'F' | 'Other';
}

export interface ResultEntry {
  id?: number;
  studentId: number;
  subjectId: number;
  termId: number;
  score: number; // e.g. 78.5
  grade?: string;
  remarks?: string;
}

export interface AuthResponse {
  accessToken: string,
  refreshToken: string
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'admin' | 'teacher';
}

export interface NavItem {
  label: string;
  route?: string;
  children?: NavItem[];
  action?: () => void;
}

export interface UserDetail {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CourseDetail {
  id: number;
  code: string;
  title: string;
  creditUnit: string;
}

export interface EnrollmentDetail {
  id: number;
  enrollmentName: string;
  course: CourseDetail;
  students: UserDetail[];
  magisters: UserDetail[];
  startDate: string;
}

export interface SingleResultModal {
  sId: number;
  eId: number;
  firstName: string;
  lastName: string;
}

export interface EntityListData {
  title: string;
  subtitle: string;
  type: string;
}
