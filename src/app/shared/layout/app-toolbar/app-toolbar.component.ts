import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AdminModeService } from 'src/app/core/services/admin-mode.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.css']
})
export class AppToolbarComponent {
  adminMode$!: Observable<boolean>;

  constructor(public adminModeService: AdminModeService) {
    this.adminMode$ = this.adminModeService.adminMode$;
  }
}
