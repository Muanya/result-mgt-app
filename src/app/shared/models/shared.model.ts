import { UserRole } from "./shared.enum";



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
  phone?: string;
  enrollmentDate?: Date;
  status?: 'active' | 'inactive' | 'graduated';
  avatar?: string;
  dateOfBirth?: Date;
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
  status?: string
}

export interface SingleResultModal {
  sId: number;
  eId: number;
  firstName: string;
  lastName: string;
}


export interface EntityListData {
  id: string;
  title: string;
  subtitle: string;
  type?: string;
  avatar?: string;
  icon?: string;
  description?: string;
  metadata?: { label: string; value: string }[];
  actions?: EntityAction[];
  status?: string;
  date?: string;
}

export interface EntityAction {
  label: string;
  icon: string;
  handler?: (item: EntityListData) => void;
}

export type ExportFormat = 'csv' | 'excel' | 'json' | 'pdf';

export interface EntityFilterState {
  searchTerm: string;
  selectedTypes: string[];
  selectedStatus: string;
  dateRange: { start: Date | null; end: Date | null };
}

export interface EntityAction {
  label: string;
  icon: string;
  handler?: (item: EntityListData) => void;
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