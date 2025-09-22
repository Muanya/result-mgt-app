import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(private http: HttpClient) { }

  getAll() {
    // Mock data - replace with actual HTTP call
    return {
      subscribe: (callback: (data: any[]) => void) => {
        const mockData = [
          { id: 1, name: 'Mathematics' },
          { id: 2, name: 'Science' },
          { id: 3, name: 'History' }
        ];
        callback(mockData);
      }
    };
  }

  bulkCreate(results: any[]) {
  return this.http.post('/api/results/bulk', { results });
}
  
}
