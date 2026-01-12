import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { environment } from 'src/environments/environment';
import { RecipeCreate } from '../models/recipe-create.model';
import { RecipeUpdate } from '../models/recipe-update.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private apiUrl = `${environment.apiUrl}/recipes`;

  constructor(private http: HttpClient) { }

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  deleteRecipeById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createRecipe(recipeBody: RecipeCreate): Observable<void> {
    return this.http.post<void>(this.apiUrl, recipeBody);
  }

  updateRecipe(id: number, recipeBody: RecipeUpdate): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, recipeBody);
  }
}
