import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Recipe } from 'src/app/features/recipes/models/recipe.model';

@Injectable({
    providedIn: 'root'
})
export class SearchUtilsService {

    private searchSubject = new BehaviorSubject<string>('');
    searchTerm$ = this.searchSubject.asObservable();

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

    //Check if a recipe contains a term
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

    //Emit a new global research
    setSearchTerm(term: string) {
        this.searchSubject.next(this.normalize(term));
    }

    resetSearch() {
        this.searchSubject.next(''); // vide le filtre
    }
}
