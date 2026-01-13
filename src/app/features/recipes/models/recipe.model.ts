import { RecipeIngredient } from './recipe-ingredient.model';
import { Step } from './step.model';

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  servings: number;
  imageUrl: string;
  ingredients: RecipeIngredient[];
  steps: Step[];
}
