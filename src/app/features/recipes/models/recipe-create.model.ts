import { RecipeIngredientCreate } from './recipe-ingredient-create.model';

export interface RecipeCreate {
  title: string;
  description?: string;
  servings: number;
  ingredients: RecipeIngredientCreate[];
}
