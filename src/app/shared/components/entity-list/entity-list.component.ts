import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { EntityListData } from '../../models/shared.model';

@Component({
  selector: 'app-entity-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './entity-list.component.html',
  styleUrl: './entity-list.component.scss'
})
export class EntityListComponent implements OnInit{
    @Input() data: EntityListData[] = [];
  @Input() title: string = 'Entities';

  isGridView = true;

   paginatedData: any[] = [];
  pageSize = 5;
  currentPage = 0;

  ngOnInit(): void {
    this.updatePaginatedData();
  }

  toggleView() {
    this.isGridView = !this.isGridView;
  }

    onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedData();
  }

  private updatePaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.data.slice(startIndex, endIndex);
  }

}
