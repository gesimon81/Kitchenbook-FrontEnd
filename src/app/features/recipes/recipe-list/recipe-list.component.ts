import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AdminModeService } from 'src/app/core/services/admin-mode.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { SearchUtilsService } from 'src/app/shared/services/search-utils.service';

@Component({
  selector: 'app-recipe-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit {

  adminMode$!: Observable<boolean>;
  
  recipes: Recipe[] = [];

  // While filtering, we don't alter recipes to avoid the need of a new API request
  filteredRecipes: Recipe[] = [];
  searchTerm = '';

  loading = true; 

  constructor(
    private recipeService: RecipeService, 
    public adminModeService: AdminModeService, 
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private searchUtils: SearchUtilsService
  ) {
    this.adminMode$ = this.adminModeService.adminMode$;
  }

  ngOnInit(): void {
    this.recipeService.getAllRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.filteredRecipes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur API pour getAllRecipes()', err);
        this.loading = false;
      }
    });
  }

  deleteRecipe(recipeId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmer la suppression',
        message: 'Voulez-vous vraiment supprimer cette recette ?',
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // l'utilisateur a confirmé
        this.recipeService.deleteRecipeById(recipeId).subscribe({
          next: () => {
            this.recipes = this.recipes.filter(r => r.id !== recipeId);
            this.snackBar.open("Recette supprimée ✅", 'Fermer', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['custom-snackbar']
            });
          },
          error: (err) => {
            console.error('Erreur lors de la suppression', err);
            this.snackBar.open("Erreur lors de la suppression ❌", 'Fermer', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['custom-snackbar']
            });
          }
        });
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;

    this.filteredRecipes = this.recipes.filter(recipe =>
      this.searchUtils.recipeMatches(recipe, value)
    );
  }
}
