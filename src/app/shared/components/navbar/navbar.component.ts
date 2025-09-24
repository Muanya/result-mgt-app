import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavItem } from '../../models/shared.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() logo: string = 'CEFI';
  @Input() navItems: NavItem[] = [];

}
