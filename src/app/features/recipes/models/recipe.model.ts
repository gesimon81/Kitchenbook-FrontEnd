import { RecipeIngredient } from './recipe-ingredient.model';

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  servings: number;
  ingredients: RecipeIngredient[];
}
