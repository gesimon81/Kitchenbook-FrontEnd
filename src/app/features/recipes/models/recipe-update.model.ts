import { RecipeIngredientUpdate } from './recipe-ingredient-update.model';

export interface RecipeUpdate {
  title: string;
  description?: string;
  servings: number;
  ingredients: RecipeIngredientUpdate[];
}
