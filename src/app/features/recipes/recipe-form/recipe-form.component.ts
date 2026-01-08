import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { RecipeCreate } from '../models/recipe-create.model';
import { RecipeIngredientCreate } from '../models/recipe-ingredient-create.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-recipe-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.css'
})
export class RecipeFormComponent {

  isFormEdit = false;

  recipeForm!: FormGroup;

  unitOptions = ['g', 'kg', 'ml', 'l', 'pcs'];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      servings: [1, [Validators.required, Validators.min(1)]],
      ingredients: this.fb.array([], Validators.required)
    });
  }

  // INGREDIENTS

  // get permet d'avoir un attribut qui pourra être équivalent de this.getIngredients()
  // Il maintient l'accès à la donnée malgré les mises à jour par rapport à un "ingredients: FormArray"
  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient(ingredient: RecipeIngredientCreate): void {
    this.ingredients.push(
      this.fb.group({
        name: [ingredient.name, Validators.required],
        quantity: [ingredient.quantity, [Validators.required, Validators.min(0.01)]],
        unit: [ingredient.unit, Validators.required]
      })
    );
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  // SUBMIT

  submit(): void {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    const recipePayload: RecipeCreate = this.recipeForm.value;

    this.recipeService.createRecipe(recipePayload).subscribe({
      next: () => this.router.navigate(['/recipes']),
      error: () => alert('Erreur lors de la création de la recette')
    });
  }
}
