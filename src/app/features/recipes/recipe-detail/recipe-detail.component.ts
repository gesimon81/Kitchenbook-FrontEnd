import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIcon } from '@angular/material/icon';
import { AdminModeService } from 'src/app/core/services/admin-mode.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-recipe-detail',
  imports: [CommonModule, MatCardModule, MatDividerModule, MatListModule, MatProgressSpinnerModule, MatIcon, RouterModule],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe!: Recipe;
  @Input() idRecipe?: number;

  adminMode$!: Observable<boolean>;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private location: Location,
    public adminModeService: AdminModeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.adminMode$ = this.adminModeService.adminMode$;
  }

  ngOnInit(): void {
    const idFromInput = this.idRecipe;
    const idFromRoute = Number(this.route.snapshot.paramMap.get('id')) || undefined;
    const idToUse = idFromInput ?? idFromRoute;

    console.log('recipe detail id - input:', idFromInput, 'route:', idFromRoute, 'used:', idToUse);

    if (!idToUse) {
      console.error('No recipe id provided to RecipeDetailComponent');
      return;
    }

    this.recipeService.getRecipeById(idToUse).subscribe({
      next: (data) => {
        this.recipe = data;
      },
      error: (err) => {
        console.error('Erreur API pour getRecipeById()', err);
      }
    });
  }

  goBack(): void {
    this.location.back();
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
            // Afficher la snackbar
            this.snackBar.open("Recette supprimée ✅", 'Fermer', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['custom-snackbar']
            });

            // Rediriger vers la liste des recettes
            this.router.navigate(['/recipes']);
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
}
