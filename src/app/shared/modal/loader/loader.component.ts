import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { LoaderType, LoaderSize, LoaderColor } from '../../models/shared.enum';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  @Input() type: LoaderType = 'spinner';
  @Input() size: LoaderSize = 'medium';
  @Input() color: LoaderColor = 'primary';
  @Input() message: string = 'Loading...';
  @Input() showProgress: boolean = false;
  @Input() progressValue: number = 0;
  @Input() overlay: boolean = false;
  @Input() fullScreen: boolean = false;

  private progressSubscription?: Subscription;
  public progress$ = new BehaviorSubject<number>(0);

  ngOnInit() {
    if (this.showProgress && this.progressValue === 0) {
      this.simulateProgress();
    } else if (this.progressValue > 0) {
      this.progress$.next(this.progressValue);
    }
  }

  ngOnDestroy() {
    this.progressSubscription?.unsubscribe();
  }

  private simulateProgress() {
    this.progressSubscription = interval(100).subscribe(() => {
      const currentProgress = this.progress$.value;
      if (currentProgress < 90) {
        const increment = Math.random() * 10;
        this.progress$.next(currentProgress + increment);
      }
    });
  }

  get spinnerDiameter(): number {
    switch (this.size) {
      case 'small': return 40;
      case 'large': return 80;
      default: return 60;
    }
  }

  get strokeWidth(): number {
    switch (this.size) {
      case 'small': return 3;
      case 'large': return 6;
      default: return 4;
    }
  }

  get materialColor(): string {
    return this.color === 'success' ? 'primary' : this.color;
  }
}