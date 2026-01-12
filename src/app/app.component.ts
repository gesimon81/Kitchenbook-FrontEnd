import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppToolbarComponent } from "./shared/layout/app-toolbar/app-toolbar.component";
import { AdminModeService } from './core/services/admin-mode.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, AppToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'kitchenbook-front';

  constructor(public adminModeService: AdminModeService) {}
}
