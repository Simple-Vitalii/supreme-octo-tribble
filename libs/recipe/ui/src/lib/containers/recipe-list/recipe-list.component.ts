import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppEntityServices } from '@recipe-app-ngrx/rcp-entity-store';
import { RecipeEntityCollectionService } from '@recipe-app-ngrx/recipe/state';
import { Observable, Subject } from 'rxjs';
import { Recipe } from '@recipe-app-ngrx/models';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'rcp-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  componentName = 'RecipeListComponent';
  recipeEntityService: RecipeEntityCollectionService;

  filteredRecipes$: Observable<Recipe[]>;
  countFilteredRecipes$: Observable<number>;

  private _destroy$ = new Subject();
  constructor(
    private appEntityServices: AppEntityServices,

  ) {
    this.recipeEntityService = appEntityServices.recipeEntityCollectionService;
  }

  ngOnInit() {
    this.filteredRecipes$ = this.recipeEntityService.filteredEntitiesByAllFilters$;
    this.countFilteredRecipes$ = this.recipeEntityService.countFilteredRecipes$;
    this.loadRecipes();
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  loadRecipes() {
    this.recipeEntityService.loadRecipesByFilters({ tag: this.componentName }).pipe(
      takeUntil(this._destroy$)
    ).subscribe();
  }

}