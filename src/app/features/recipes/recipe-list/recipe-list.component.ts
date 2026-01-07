import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AdminModeService } from 'src/app/core/services/admin-mode.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit {

  adminMode$!: Observable<boolean>;
  
  recipes: Recipe[] = [];
  loading = true; 

  constructor(private recipeService: RecipeService, public adminModeService: AdminModeService) {
    this.adminMode$ = this.adminModeService.adminMode$;
  }

  ngOnInit(): void {
    this.recipeService.getAllRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur API pour getAllRecipes()', err);
        this.loading = false;
      }
    });
  }

  deleteRecipe(arg0: number) {
    throw new Error('Method not implemented.');
  }
  
  editRecipe(_t12: Recipe) {
    throw new Error('Method not implemented.');
  }
}
