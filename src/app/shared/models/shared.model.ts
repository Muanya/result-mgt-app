import e from "express";
import { UserRole } from "./shared.enum";

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
  role: UserRole
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
  role: UserRole;

}

export interface CourseDetail {
  id: number;
  code: string;
  title: string;
  creditUnit: number;
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

export interface RawResultDetail {
  id: number;
  score: number;
  grade: string;
  studentId: number;
  enrollmentId: number;
  courseId: number;
  studentName?: string;
  courseTitle?: string;
}


export interface StudentGrade {
  studentId: string;
  studentName: string;
  courses: {
    [subjectId: string]: {
      score: number;
      grade: string;
    };
  };
  average: number;
  rank?: number;
}

export interface GradeSummary {
  subjectId: number;
  subjectName: string;
  average: number;
  highest: number;
  lowest: number;
  passRate: number;
  totalStudents: number;
}

export interface FilterOptions {
  subject: number[];
  gradeRange: {
    min: number;
    max: number;
  };
}

// export interface SortOptions {
//   field: string;
//   direction: 'asc' | 'desc';
// }