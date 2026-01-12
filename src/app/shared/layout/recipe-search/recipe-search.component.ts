import { Component } from '@angular/core';
import { SearchUtilsService } from '../../services/search-utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recipe-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.css']
})
export class RecipeSearchComponent {

  searchTerm = '';


  constructor(
    private searchUtilsService: SearchUtilsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  submit(): void {
  const term = this.searchUtilsService.normalize(this.searchTerm);
  if (!term) return;

  // Toujours mettre à jour le service pour le filtrage immédiat
  this.searchUtilsService.setSearchTerm(term);

  // Si on est pas déjà sur /recipes, naviguer pour afficher la liste
  const currentUrl = this.route.snapshot.routeConfig?.path;
  if (currentUrl !== 'recipes') {
    this.router.navigate(['/recipes'], { queryParams: { search: term } });
  }
}

}
