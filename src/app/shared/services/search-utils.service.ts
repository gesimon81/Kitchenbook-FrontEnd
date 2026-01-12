import { Injectable } from '@angular/core';
import { Recipe } from 'src/app/features/recipes/models/recipe.model';

@Injectable({
    providedIn: 'root'
})
export class SearchUtilsService {

    normalize(value: string): string {
        return value
            .toLowerCase()
            .normalize('NFD') //To avoid errors based on accents like é,à... (separate the base letter from the accent)
            .replace(/[\u0300-\u036f]/g, '') //Removes all diacritical marks to make search accent-insensitive
            // Normalize typographic apostrophes and quotes to plain ASCII. This avoids mismatches caused by copy/paste or rich-text sources
            .replace(/[’‘‛‹›]/g, "'")
            .replace(/[“”«»]/g, '"')
            // Normalize multiple spaces
            .replace(/\s+/g, ' ')
            .trim();
    }

    recipeMatches(recipe: Recipe, searchTerm: string): boolean {
        const term = this.normalize(searchTerm);

        if (!term) {
        return true;
        }

        const titleMatch =
        this.normalize(recipe.title).includes(term);

        const ingredientMatch =
        recipe.ingredients?.some(ingredient =>
            this.normalize(ingredient.name).includes(term)
        );

        return titleMatch || ingredientMatch;
    }
}
