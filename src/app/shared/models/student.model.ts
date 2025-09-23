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

