import { Routes } from '@angular/router';
import { RecipeListComponent } from './features/recipes/recipe-list/recipe-list.component';
import { RecipeFormComponent } from './features/recipes/recipe-form/recipe-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'recipes', pathMatch: 'full' },
  { path: 'recipes', component: RecipeListComponent },
  { path: 'recipes/new', component: RecipeFormComponent },
  { path: 'recipes/:id', loadComponent: () => import('./features/recipes/recipe-detail/recipe-detail.component').then(m => m.RecipeDetailComponent) },
];
