import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, Observable, Subject, takeUntil } from 'rxjs';
import { Country, Filters, Genre, Language } from 'src/app/core/model/card';
import { PostsService } from 'src/app/core/services/posts.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  // Search input control with non-nullable string type
  searchControl = new FormControl<string>('', { nonNullable: true });  allGenre$!:Observable<Genre[]>;
  // Observables holding configuration data for genres, countries, and languages
  allCountries$!: Observable<Country[]>;
  allLanguages$!: Observable<Language[]>;
  // Subject used to clean up all subscriptions on component destroy
  private destroy$ = new Subject<void>();
  // Tracks how many items are visible for each filter section (e.g., genres, years)
  visibleCounts: Record<string, number> = {
    genres: 8,
    years: 8,
    countries:8,
    languages:8,
  };
  // Local state to track currently selected filters
  selectedFilters:any = {
    genre: [] as  number[],
    country: [] as string[],
    year: [] as number[],
    language: [] as string[]
  }


  constructor(private _PostsService:PostsService, private router: Router, private route: ActivatedRoute ){}
  ngOnInit(){
    this.loadGenresBasedOnRoute();
    this.getCountries();
    this.getLanguages();
    this.UrlDrivenState();
    this.updateUrl();
    this.onSearchChange()
  }
  // Merge genres from both Movies and TV for Home page. Deduplicates genres based on genre.id.
  getMergedGenres(){
    this.allGenre$ = this._PostsService.mergeGenre().pipe(
      map(res =>{
        const merged:Genre[] = [
          ...res.movies.genres || [],
          ...res.tv.genres || [],
        ];
        // Deduplicate by genre id
        const uniqueGenres = merged.filter(
        (genre, index, self) =>
        index === self.findIndex((g) => g.id === genre.id)
        );
        return uniqueGenres;
        
      })
    )
  } 
  // Fetch genres for a single media type (Movie or TV)  , Used for movie/tv pages.
  getSingleGenre(type:string) {
    this.allGenre$ = this._PostsService.getGenreList(type).pipe(
      map(res => res.genres || []) 
    );
  }
  // Decide which genre-fetching method to use based on the current route.
  loadGenresBasedOnRoute() {
    const path = this.router.url;;     
    if (path?.includes('home') || path === '/') {
      this.getMergedGenres();
    } else if (path?.includes('movie')) {
      this.getSingleGenre('movie');
    } else if (path?.includes('tv')) {
      this.getSingleGenre('tv');
    }
  }
  // Fetch countries list from TMDB configuration endpoint
  getCountries() {
    this.allCountries$ = this._PostsService
      .getConfigurationList('countries')
      
  }
  // Fetch languages list from TMDB configuration endpoint 
  getLanguages() {
    this.allLanguages$ = this._PostsService
      .getConfigurationList('languages')
      
  }
  // Build array of years for filtering (last 30 years)
  currentYear = new Date().getFullYear();
  years = Array.from({length: 30}, (_, i) => this.currentYear - i);
  // Toggle between showing a subset or all items in filter lists
  toggleVisible(type: string, totalLength: number) {
    if (this.visibleCounts[type] === 8) {
    this.visibleCounts[type] = totalLength; // show all
  } else {
    this.visibleCounts[type] = 8; // show less
  }
  }
  // Return the label for the "show more / show less" button dynamically
  getButtonLabel(type: string, totalLength: number) {
    return this.visibleCounts[type] >= totalLength
      ? 'Show Less'
      : 'Show More';
  }
  /**
   * Sync URL query parameters with service filters (state-driven)
   * - Updates selectedFilters local state
   * - Triggers service to fetch new content when query params change
   */
  UrlDrivenState() {
    this.route.queryParams
      .pipe(
        map(params => ({
          genre: params['with_genres'] ? params['with_genres'].split(',').map(Number) : [],
          year: params['primary_release_year'] ? params['primary_release_year'].split(',').map(Number) : [],
          language: params['with_original_language'] ? params['with_original_language'].split(',') : [],
          country: params['with_origin_country'] ? params['with_origin_country'].split(',') : [],
          page: params['page'] ? +params['page'] : 1,
          search: params['search'] || undefined
        })),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntil(this.destroy$),
      )
      .subscribe(newFilters => {
        this.selectedFilters = { ...newFilters };
        this._PostsService.filters$.next(newFilters);
      });
  }
/**
   * Update the URL query params whenever service filters change.
   * Ensures back/forward navigation and sharing URLs work correctly.
   */
  updateUrl() {
    this._PostsService.filters$
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters: Filters) => {
      const queryParams: any = { page: filters.page || 1 };
      // Map filters to URL param keys
      const filterMap: Record<string, any> = {
        with_genres: filters.genre,
        primary_release_year: filters.year,
        with_original_language: filters.language,
        with_origin_country: filters.country,
        search: filters.search?.trim() || null
      };

      // Build query params only if valid
      Object.entries(filterMap).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length) {
          queryParams[key] = value.join(',');
        } else if (typeof value === 'string' || value === null) {
          queryParams[key] = value;
        }
      });

      // Trigger navigation without affecting history state
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: ''
      });
    });
  }
  //Update selected filters when a checkbox changes and Ensures immutable updates to local and service state.
  updateCheckboxFilter(type: keyof Filters, value: any, event: any){
    const checked = event.target.checked;
    if (!Array.isArray(this.selectedFilters[type])) this.selectedFilters[type] = [];
    this.selectedFilters[type] = checked
      ? [...this.selectedFilters[type], value]
      : this.selectedFilters[type].filter((v: any) => v !== value);
    // Update service filters with page reset
    this._PostsService.filters$.next({ 
      ...this._PostsService.filters$.value, 
      [type]: this.selectedFilters[type], 
      page: 1 
    });
  }
  // Listen to search input changes and update service filters and Debounce to reduce excessive API calls
  onSearchChange(){
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe(value => {
      this._PostsService.filters$.next({
        ...this._PostsService.filters$.value,
        search: value ? String(value) : undefined,
        page: 1
      });
    });
  }
  //Update the currently selected category in the side menu.
  //Also determines the media type based on the current route.
  setCategory( category:string){
    const url = this.router.url;
    let media_type: string| null = null; ;
    if(url.includes('movie')){
      media_type = 'movie';
    }
    if(url.includes('tv')){
      media_type = 'tv'
    }
    this._PostsService.filters$.next({
      ...this._PostsService.filters$.value,
      media_type: media_type,
      category: category,
      page:1

    })
  }
  // Cleanup all subscriptions to prevent memory leaks
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
