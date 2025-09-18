export interface Student {
  id?: number;
  admissionNo: string;
  firstName: string;
  lastName?: string;
  dob?: string; // ISO date
  classId?: number;
  gender?: 'M'|'F'|'Other';
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
