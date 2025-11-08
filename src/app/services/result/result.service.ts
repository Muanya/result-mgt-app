import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StudentGrade, FilterOptions, GradeSummary, CourseDetail, RawResultDetail } from '../../shared/models/shared.model';
import { Grade } from '../../shared/models/shared.constant';
import { ApiService } from '../api/api.service';
import { UtilService } from '../util/util.service';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  private courses = new BehaviorSubject<CourseDetail[]>([]);
  private students: StudentGrade[] = [];
  private filteredStudents = new BehaviorSubject<StudentGrade[]>([]);

  constructor(private http: HttpClient, private apiService: ApiService, private utilService: UtilService) {
    if (this.utilService.isBrowser) {
      this.generateResultsData()
    }
    // this.generateMockData();
  }
  private generateMockData() {
    // Generate 30 subjects
    const courses = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      title: this.generateSubjectName(i),
      code: `SUB${(i + 1).toString().padStart(2, '0')}`,
      creditUnit: i % 3 === 0 ? 4 : 3,
    }));

    this.courses.next(courses);

    // Generate 1000 students
    this.students = Array.from({ length: 100 }, (_, i) => {
      const courses: { [key: string]: any } = {};
      this.courses.value.forEach(subject => {
        courses[subject.id] = this.generateGrade();
      });

      const subjectGrades = Object.values(courses);
      const total = subjectGrades.reduce((sum, grade) => sum + grade.score, 0);
      const average = total / subjectGrades.length;


      return {
        studentId: `STU${(i + 1).toString().padStart(4, '0')}`,
        studentName: `Student ${i + 1}`,
        courses,
        average: Number(average.toFixed(2)),
      };
    });

    this.calculateRanks();
    this.filteredStudents.next(this.students);
  }

  private generateResultsData() {
    // Placeholder for actual data generation logic if needed
    // this.apiService.getResultsByStudent(1).pipe().subscribe(data => {
    //   console.log(data, "results data");

    //   if(data.length > 0) { 
    //     const studentGrade = this.convertResultDetailsToStudentGrade(data);
    //     console.log(studentGrade, "converted student grade");
    //     this.students = [studentGrade];
    //     this.filteredStudents.next(this.students);
    //   }
    // });

    this.apiService.getAllCourses().pipe().subscribe(data => {

      console.log(data, "courses data");
      this.courses.next(data);


    });

    this.apiService.getResultsForAllStudent().pipe().subscribe(data => {
      console.log(data, "results data");

      if (data.length > 0) {
        const studentGrades = this.convertResultDetailsToStudentGrade(data);
        console.log(studentGrades, "converted student grade");
        this.students = studentGrades;
        this.calculateRanks();
        this.filteredStudents.next(this.students);
      }
    });
  }


  convertResultDetailsToStudentGrade(results: RawResultDetail[]): StudentGrade[] {
    const studentMap = new Map<number, StudentGrade>();

    results.forEach(result => {
      let student = studentMap.get(result.studentId);

      if (!student) {
        student = {
          studentId: result.studentId.toString(),
          studentName: result.studentName ?? `Student ${result.studentId}`,
          courses: {},
          average: 0
        };
        studentMap.set(result.studentId, student);
      }

      student.courses[result.courseId] = {
        score: result.score,
        grade: result.grade
      };
    });

    // compute average per student
    studentMap.forEach(student => {
      const scores = Object.values(student.courses).map(c => c.score);
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;
      student.average = Number(average.toFixed(2));
    });

    return Array.from(studentMap.values());
  }

  private generateSubjectName(index: number): string {
    const prefixes = ['Advanced', 'Basic', 'Introduction to', 'Principles of'];
    const subjects = [
      'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History',
      'Geography', 'Computer Science', 'Art', 'Music', 'Physical Education',
      'Economics', 'Business Studies', 'Psychology', 'Sociology', 'Philosophy',
      'Foreign Language', 'Literature', 'Calculus', 'Statistics',
      'Programming', 'Database Systems', 'Networking', 'Web Development',
      'Data Structures', 'Algorithms', 'Operating Systems', 'Cyber Security',
      'Artificial Intelligence', 'Machine Learning'
    ];

    const prefix = index % 4 === 0 ? prefixes[Math.floor(index / 4) % prefixes.length] + ' ' : '';
    return prefix + subjects[index % subjects.length];
  }

  private generateGrade(): { score: number, grade: string } {
    // Generate grades with normal distribution around 75
    const grade = Math.floor(Math.random() * 40) + 40; // 30-100
    return {
      score: Math.min(100, Math.max(0, grade)),
      grade: this.getGrade(grade)
    }
  }

  private calculateRanks() {
    const sorted = [...this.students].sort((a, b) => b.average - a.average);
    sorted.forEach((student, index) => {
      student.rank = index + 1;
    });
  }

  getGrade(score: number): Grade {
    if (score >= 96) return Grade.SUMMA;
    if (score >= 85) return Grade.MAGNA;
    if (score >= 70) return Grade.CUM_LAUDE;
    if (score >= 50) return Grade.PASS;
    return Grade.NO_PASS;
  }



  getCourses(): Observable<CourseDetail[]> {
    return this.courses.asObservable();
  }

  getStudents(): Observable<StudentGrade[]> {
    return this.filteredStudents.asObservable();
  }

  getGradeSummary(): GradeSummary[] {
    return this.courses.value.map(subject => {
      const grades = this.students.map(student => student.courses[subject.id]);
      const passed = grades.filter(grade => grade.score >= 50).length;

      return {
        subjectId: subject.id,
        subjectName: subject.title,
        average: Number(
          (grades.reduce((a, b) => a + b.score, 0) / grades.length).toFixed(2)
        ), highest: Math.max(...grades.map(g => g.score)),
        lowest: Math.min(...grades.map(g => g.score)),
        passRate: Number(((passed / grades.length) * 100).toFixed(1)),
        totalStudents: grades.length
      };
    });
  }

  getFilterOptions(): FilterOptions {
    const subjects = this.courses.value.map(s => s.id);

    return {
      subject: subjects,
      gradeRange: { min: 0, max: 100 }
    };
  }

  exportToCSV(): string {
    const headers = ['Student ID', 'Name', ...this.courses.value.map(s => s.code), 'Average', 'Rank'];
    const data = this.filteredStudents.value.map(student => [
      student.studentId,
      student.studentName,
      ...this.courses.value.map(subject => student.courses[subject.id]),
      student.average,
      student.rank
    ]);

    return [headers, ...data].map(row => row.join(',')).join('\n');
  }

  // private applyFiltersAndSort() {
  //   let filtered = [...this.students];

  //   const filters = this.currentFilters.value;
  //   const sort = this.currentSort.value;

  //   // Apply filters
  //   if (filters.class?.length) {
  //     filtered = filtered.filter(student => filters.class!.includes(student.class));
  //   }

  //   if (filters.section?.length) {
  //     filtered = filtered.filter(student => filters.section!.includes(student.section));
  //   }

  //   if (filters.gradeRange) {
  //     filtered = filtered.filter(student =>
  //       student.average >= filters.gradeRange!.min &&
  //       student.average <= filters.gradeRange!.max
  //     );
  //   }

  //   // Apply sorting
  //   filtered.sort((a, b) => {
  //     let aValue: any, bValue: any;

  //     switch (sort.field) {
  //       case 'name':
  //         aValue = a.studentName;
  //         bValue = b.studentName;
  //         break;
  //       case 'class':
  //         aValue = a.class;
  //         bValue = b.class;
  //         break;
  //       case 'average':
  //         aValue = a.average;
  //         bValue = b.average;
  //         break;
  //       case 'attendance':
  //         aValue = a.attendance;
  //         bValue = b.attendance;
  //         break;
  //       default:
  //         aValue = a.rank || 0;
  //         bValue = b.rank || 0;
  //     }

  //     if (typeof aValue === 'string') {
  //       return sort.direction === 'asc'
  //         ? aValue.localeCompare(bValue)
  //         : bValue.localeCompare(aValue);
  //     } else {
  //       return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
  //     }
  //   });

  //   this.filteredStudents.next(filtered);
  // }

}
