import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { RecipeCreate } from '../models/recipe-create.model';
import { RecipeIngredientCreate } from '../models/recipe-ingredient-create.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from "@angular/material/icon";
import { Recipe } from '../models/recipe.model';
import { RecipeUpdate } from '../models/recipe-update.model';
import { Step } from '../models/step.model';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-recipe-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIcon,
    DragDropModule
],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.css'
})
export class RecipeFormComponent {

  isFormEdit = false;

  recipeId: number | undefined;

  recipeForm!: FormGroup;

  unitOptions = ['g', 'kg', 'ml', 'l', 'pcs'];

  imagePreview: string | undefined = undefined;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isFormEdit = !!id;

    // toujours créer le form vide
    this.initForm();

    if(this.isFormEdit && id) {
      this.loadRecipeForEdit(+id);
    }
  }

  private initForm(): void {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      servings: [1, [Validators.required, Validators.min(1)]],
      imageUrl: [''],
      ingredients: this.fb.array([], Validators.required),
      steps: this.fb.array([], Validators.required)
    });

    this.recipeForm.get('imageUrl')?.valueChanges.subscribe(url => {
      this.imagePreview = url; // mettre à jour la propriété
    });
  }

  private loadRecipeForEdit(id: number): void {
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.recipeId = recipe.id;

        this.recipeForm.patchValue({
          title: recipe.title,
          description: recipe.description,
          servings: recipe.servings,
          imageUrl: recipe.imageUrl || ''
        });

        this.imagePreview = recipe.imageUrl || '';

        // Reset form arrays (sécurité si reload ou navigation interne)
        this.ingredients.clear();
        this.steps.clear();

        // INGREDIENTS
        recipe.ingredients.forEach(i =>
          this.ingredients.push(
            this.fb.group({
              name: [i.name, Validators.required],
              quantity: [i.quantity, [Validators.required, Validators.min(0.01)]],
              unit: [i.unit, Validators.required]
            })
          )
        );

        // STEPS (triés par stepOrder)
        recipe.steps
          .sort((a, b) => a.stepOrder - b.stepOrder)
          .forEach(s =>
            this.steps.push(
              this.fb.group({
                content: [s.content, Validators.required],
                stepOrder: [s.stepOrder, Validators.required]
              })
            )
          );
      },
      error: () => alert('Erreur de chargement de la recette')
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

  // STEPS
  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  addStep(content: string): void {
    const order = this.steps.length + 1;
    this.steps.push(
      this.fb.group({
        content: [content, Validators.required],
        stepOrder: [order, Validators.required]
      })
    );
  }

  removeStep(index: number): void {
    this.steps.removeAt(index);
  }

  dropStep(event: CdkDragDrop<FormGroup[]>): void {
    const stepsArray = this.steps.controls;
    moveItemInArray(stepsArray, event.previousIndex, event.currentIndex);
    this.updateStepOrders();
  }

  private updateStepOrders(): void {
    this.steps.controls.forEach((ctrl, idx) => {
      ctrl.get('stepOrder')?.setValue(idx + 1, { emitEvent: false });
    });
  }

  // SUBMIT

  submit(): void {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    // Separate new and edit
    if(this.isFormEdit) {
      if(this.recipeId) {
        const recipePayload: RecipeUpdate = this.recipeForm.value;

        this.recipeService.updateRecipe(this.recipeId, recipePayload).subscribe({
          next: () => this.router.navigate(['/recipes', this.recipeId]),
          error: () => alert('Erreur lors de mise à de la recette')
        })
      } else {
        alert('Erreur lors de mise à de la recette: données non chargées depuis l\'api')
      }
    } else {
      const recipePayload: RecipeCreate = this.recipeForm.value;

      this.recipeService.createRecipe(recipePayload).subscribe({
        next: () => this.router.navigate(['/recipes']),
        error: () => alert('Erreur lors de la création de la recette')
      });
    }
    
  }

  cancel() {
    if(this.isFormEdit && this.recipeId) {
      this.router.navigate(['/recipes', this.recipeId]);      
    } else {
      this.router.navigate(['/recipes'])
    };
  }
  
}
