import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule, MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EntityListData, EntityAction, ExportFormat } from '../../models/shared.model';
import { LoaderComponent } from '../../modal/loader/loader.component';

@Component({
  selector: 'app-entity-list',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatToolbarModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    LoaderComponent
  ],
  templateUrl: './entity-list.component.html',
  styleUrl: './entity-list.component.scss'
})
export class EntityListComponent implements OnInit, OnChanges {
  @Input() data: EntityListData[] = [];
  @Input() title: string = 'Entities';
  @Input() isLoading: boolean = false;
  @Output() view = new EventEmitter<EntityListData>();
  @Output() edit = new EventEmitter<EntityListData>();
  @Output() action = new EventEmitter<{ action: EntityAction, item: EntityListData }>();
  @Output() export = new EventEmitter<{ format: ExportFormat, data: EntityListData[] }>();
  @Output() createNew = new EventEmitter<void>();

  // View state - FIXED: Use boolean for internal state, string values for toggle group
  isGridView = true;
  showFilterPanel = false;

  // Search and filter state
  searchTerm = '';
  selectedType: string[] = [];
  selectedStatus = '';
  dateRange = { start: null as Date | null, end: null as Date | null };

  // Data state
  filteredData: EntityListData[] = [];
  paginatedData: EntityListData[] = [];
  availableTypes: string[] = [];

  // Pagination
  pageSize = 10;
  currentPage = 0;

  ngOnInit(): void {
    this.initializeFilters();
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.initializeFilters();
      this.applyFilters();
    }
  }

  // View Toggle Handler - FIXED
  onViewToggleChange(event: MatButtonToggleChange): void {
    this.isGridView = event.value === 'grid';
  }

  // Alternative simple toggle method (you can use this instead if preferred)
  toggleView(): void {
    this.isGridView = !this.isGridView;
  }

  // Search functionality
  onSearchChange(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearchChange();
  }

  // Filter functionality
  initializeFilters(): void {
    // Extract unique types from data
    this.availableTypes = [...new Set(this.data
      .filter(item => item.type)
      .map(item => item.type as string)
    )].sort();
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  applyFilters(): void {
    let result = this.data;

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.subtitle.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.type?.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (this.selectedType.length > 0) {
      result = result.filter(item => item.type && this.selectedType.includes(item.type));
    }

    // Apply status filter (if your data has status property)
    if (this.selectedStatus) {
      result = result.filter(item => (item as any).status === this.selectedStatus);
    }

    // Apply date range filter (if your data has date property)
    if (this.dateRange.start || this.dateRange.end) {
      result = result.filter(item => {
        const itemDate = (item as any).date ? new Date((item as any).date) : null;
        if (!itemDate) return true;

        const startMatch = !this.dateRange.start || itemDate >= this.dateRange.start;
        const endMatch = !this.dateRange.end || itemDate <= this.dateRange.end;
        return startMatch && endMatch;
      });
    }

    this.filteredData = result;
    this.updatePaginatedData();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedType = [];
    this.selectedStatus = '';
    this.dateRange = { start: null, end: null };
    this.applyFilters();
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.searchTerm) count++;
    if (this.selectedType.length > 0) count++;
    if (this.selectedStatus) count++;
    if (this.dateRange.start || this.dateRange.end) count++;
    return count;
  }

  // Export functionality
  exportData(format: ExportFormat): void {
    const dataToExport = this.filteredData.length > 0 ? this.filteredData : this.data;
    this.export.emit({ format, data: dataToExport });
  }

  // Pagination
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedData();
  }

  getDisplayedRange(): string {
    const start = this.currentPage * this.pageSize + 1;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.filteredData.length);
    return `${start}-${end}`;
  }

  private updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
    console.log("Pppp", this.paginatedData);
    

  }

  // Event handlers
  onView(item: EntityListData): void {
    this.view.emit(item);
  }

  onEdit(item: EntityListData): void {
    this.edit.emit(item);
  }

  onAction(action: EntityAction, item: EntityListData): void {
    this.action.emit({ action, item });
  }


  // Add this method
  onCreateNew(): void {
    this.createNew.emit();
  }
}