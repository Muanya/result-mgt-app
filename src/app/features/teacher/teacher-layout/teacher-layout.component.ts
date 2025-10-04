import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-teacher-layout',
  imports: [
     CommonModule,
    RouterModule,    // for <router-outlet> and routerLink
    FormsModule,     // if you use [(ngModel)] in toolbar or sidebar

    // Angular Material
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './teacher-layout.component.html',
  styleUrl: './teacher-layout.component.scss'
})
export class TeacherLayoutComponent {

}
