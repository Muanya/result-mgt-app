import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { AnalyticsService } from '../../../services/analytics/analytics.service';


@Component({
  selector: 'app-grade-distribution',
  imports: [BaseChartDirective],
  templateUrl: './grade-distribution.component.html',
  styleUrl: './grade-distribution.component.scss',
  standalone: true,

})
export class GradeDistributionComponent implements OnInit {
  public chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Grades Distribution' }
    },
    scales: {
      x: { title: { display: true, text: 'Grade' } },
      y: { title: { display: true, text: 'No. of Students' }, beginAtZero: true }
    }
  };

  public chartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  constructor(private analytics: AnalyticsService) { }

  ngOnInit() {
    this.analytics.gradeDistribution({ classId: 1, termId: 1 }).subscribe(data => {
      this.chartData.labels = data.labels; // ['A','B','C','D','F']
      this.chartData.datasets = [{ data: data.counts, label: 'Count' }];
    });
  }


}
