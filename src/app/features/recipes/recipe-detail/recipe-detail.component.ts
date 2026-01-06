import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-recipe-detail',
  imports: [CommonModule, MatCardModule, MatDividerModule, MatListModule, MatProgressSpinnerModule, MatIcon],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe!: Recipe;
  @Input() idRecipe?: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

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


}
