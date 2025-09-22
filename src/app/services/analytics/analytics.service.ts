import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


// Backend API endpoints assumed:
/** GET /api/analytics/grade-distribution?classId=1&termId=1
   → { labels: ["A","B","C","D","F"], counts: [12, 15, 8, 5, 2] }

GET /api/analytics/average-scores?classId=1&termId=1
   → { subjects: ["Math","English","Science"], averages: [72.5, 68.0, 81.3] }

GET /api/analytics/pass-rate?classId=1&termId=1
   → { passed: 30, failed: 5 } */


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private baseUrl = '/api/analytics';

  constructor(private http: HttpClient) {}

  /** Get grade distribution counts per grade */
  gradeDistribution(params: { classId?: number; termId?: number }): Observable<{ labels: string[], counts: number[] }> {
    let httpParams = new HttpParams();
    if (params.classId) httpParams = httpParams.set('classId', params.classId.toString());
    if (params.termId) httpParams = httpParams.set('termId', params.termId.toString());

    return this.http.get<{ labels: string[], counts: number[] }>(`${this.baseUrl}/grade-distribution`, { params: httpParams });
  }

  /** Get average scores per subject */
  averageScores(params: { classId?: number; termId?: number }): Observable<{ subjects: string[], averages: number[] }> {
    let httpParams = new HttpParams();
    if (params.classId) httpParams = httpParams.set('classId', params.classId.toString());
    if (params.termId) httpParams = httpParams.set('termId', params.termId.toString());

    return this.http.get<{ subjects: string[], averages: number[] }>(`${this.baseUrl}/average-scores`, { params: httpParams });
  }

  /** Get pass/fail rate for a class/term */
  passRate(params: { classId?: number; termId?: number }): Observable<{ passed: number, failed: number }> {
    let httpParams = new HttpParams();
    if (params.classId) httpParams = httpParams.set('classId', params.classId.toString());
    if (params.termId) httpParams = httpParams.set('termId', params.termId.toString());

    return this.http.get<{ passed: number, failed: number }>(`${this.baseUrl}/pass-rate`, { params: httpParams });
  }

  /** Optional: Top performers */
  topPerformers(params: { classId?: number; termId?: number; limit?: number }): Observable<any[]> {
    let httpParams = new HttpParams();
    if (params.classId) httpParams = httpParams.set('classId', params.classId.toString());
    if (params.termId) httpParams = httpParams.set('termId', params.termId.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());

    return this.http.get<any[]>(`${this.baseUrl}/top-performers`, { params: httpParams });
  }
}
