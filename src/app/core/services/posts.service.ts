import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, forkJoin, Observable, shareReplay, switchMap } from 'rxjs';
import { CardArray, Country, DiscoverResponse, EpisodeDetails, Filters, GenreListResponse, Language, MediaDetails, MergedMedia, SeasonDetails } from '../model/card';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  // Base API URL from environment configuration
  private readonly baseUrl = environment.tmdbBaseUrl;
  /**
   * Global state for filters used across the application.
   * Using BehaviorSubject so components can reactively listen to changes.
   */
  public filters$ = new BehaviorSubject<Filters>({ page: 1 });
  /**
   * Main data stream for content.
   * Whenever filters change, a new API request is triggered.
   *
   * shareReplay is used to:
   * - prevent duplicate HTTP calls
   * - cache the latest result for new subscribers
   */
  content$ = this.filters$.pipe(
    switchMap(filters => this.getContent(filters)),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  /**
 * Maps raw TMDB API response to a consistent array of CardArray with media_type.
 * Supports both Search Multi results and merged Movies + TV.
 *
 * param res API response from searchMulti or mergeMedia
 * returns Array<CardArray> with media_type correctly set
 */
  mapMediaData(res: DiscoverResponse): { data: CardArray[], totalPages: number } {
    if (res.results) {
      // --- Search Multi response ---
      return {
        data: res.results.map((item: CardArray) => ({
          ...item,
          media_type: item.media_type || (item.title ? 'movie' : 'tv' )
        })),
        totalPages: res.total_pages || 0
      };
    }
    // --- Discover / merged movies + tv ---
    const merged: CardArray[] = [
      ...(res.movies?.results || []).map((item: CardArray) => ({ ...item, media_type: 'movie' })),
      ...(res.tv?.results || []).map((item: CardArray) => ({ ...item, media_type: 'tv' }))
    ];

    const totalPages = Math.max(
      res.movies?.total_pages || 0,
      res.tv?.total_pages || 0
    );

    return { data: merged, totalPages };
  }
  constructor(private _HttpClient:HttpClient) { }
  // Fetch media list for a specific type (movie or tv)
  // If a category is provided (e.g., popular, top_rated, upcoming),
  // the request targets the corresponding category endpoint.
  // Otherwise, it falls back to the discover endpoint with applied filters.
  getMedia(media_type:string, params:HttpParams, category?:string):Observable<DiscoverResponse>{
    const endPoint = category
    ? `${this.baseUrl}/${media_type}/${category}`
    : `${this.baseUrl}/discover/${media_type}`;
    return this._HttpClient.get(endPoint,{params});
  };
  // Fetch Movies and TV content simultaneously for the Home page and Handles category differences between Movies and TV endpoints.
  // Example mappings:
  // movie/upcoming   -> tv/on_the_air
  // movie/now_playing -> tv/airing_today
  mergeMedia(params:HttpParams, category?:string):Observable<MergedMedia>{
    let tvCategory = category;
    // Mapping for categories that differ between Movie and TV endpoints
    const categoryMap:Record <string, string> = {
      upcoming:'on_the_air',
      now_playing:'airing_today'
    }
    // If the selected category exists in the mapping and replace it with the correct TV equivalent
    if(category && categoryMap[category]){
      tvCategory = categoryMap[category]
    }
    return forkJoin({
      movies: this.getMedia('movie', params,category),
      tv: this.getMedia('tv', params,tvCategory)
    });
  };
  //Multi-search endpoint Used when user performs search query
  searchMulti(query:string, pageNumber:number = 1):Observable<DiscoverResponse>{
    const params = new HttpParams()
    .set('query', query)
    .set('page', pageNumber);
    return this._HttpClient.get(`${this.baseUrl}/search/multi`,{params})
  }
  /**
   * Dynamic Query Builder
   *
   * Converts filter object into HTTP query parameters.
   * Only active filters are appended to the request.
  */  
  private buildParams(filters: Filters): HttpParams {
    let params = new HttpParams()
    .set('page', String(filters.page || 1));
    const mapFilters: Record<string, any> = {
      with_genres: filters.genre?.join(','),
      with_origin_country: filters.country?.join(','),
      primary_release_year: filters.year?.join(','),
      with_original_language: filters.language?.join(',')
    };
    Object.entries(mapFilters).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });

    return params;
  }
  /**
  * Determines which API call to make based on current filters.
  * - If a search query exists, uses searchMulti endpoint.
  * - If a specific media_type is set, fetches that media type with optional category.
  * - Otherwise, fetches both movies and TV shows (merged).
  */
  getContent(filters: Filters): Observable<DiscoverResponse> {
    if (filters.search) {
      return this.searchMulti(filters.search, filters.page || 1);
    }
    const params = this.buildParams(filters);
    if (filters.media_type) {
      return this.getMedia(filters.media_type, params, filters.category);
    }
    return this.mergeMedia(params, filters.category);
  };
  // Fetches a specific media category (now playing, coming soon, popular, top_rated) for a given media type.
  getCategory(media_type:string, category:string, params:HttpParams):Observable<DiscoverResponse>{
    return this._HttpClient.get(`${this.baseUrl}/${media_type}/${category}`,
      {params}
    )
  }
  /**
   * Fetches the same category for both movies and TV shows simultaneously using forkJoin.
   * Ensures both API calls complete before emitting results.
  */
  mergeCategory(category:string ,params:HttpParams):Observable<MergedMedia>{
    return forkJoin({
      movies: this.getCategory('movie', category, params),
      tv: this.getCategory('tv', category, params)
    })
  }
  //Update the current page while preserving other filters.
  setPage(page:number){
    this.filters$.next({
      ...this.filters$.value,
      page
    });
  }

// START ====== SIDE MENU
  // Fetch genre list for a specific media type.
  getGenreList(mediaType:string):Observable<GenreListResponse>{
    return this._HttpClient.get(`${this.baseUrl}/genre/${mediaType}/list`)
  }

  // Fetch and merge genres for both (Movies + TV)
  mergeGenre():Observable<{movies:GenreListResponse, tv:GenreListResponse}> {
    return forkJoin({
      movies: this.getGenreList('movie'),
      tv: this.getGenreList('tv')
    });
  }
  //Fetch configuration lists such as: countries , languages
  getConfigurationList(type: string): Observable<Country[] | Language[]> {
    return this._HttpClient.get<Country[] | Language[]>(
      `${this.baseUrl}/configuration/${type}`
    );
  }
// END ====== SIDE MENU


  //Fetch single media details (movie or tv)
  getDetails(mediaType:string, id:string):Observable<MediaDetails>{
    return this._HttpClient.get(`${this.baseUrl}/${mediaType}/${id}`)
  }
  // Fetch season details for a TV show.
  getSeasonDetails(tvId: string, seasonNumber: number): Observable<SeasonDetails> {
    return this._HttpClient.get(
      `${this.baseUrl}/tv/${tvId}/season/${seasonNumber}`
    );
  }
  //Fetch episode details for a specific TV episode.
  getEpisodeDetails(tvId: string, seasonNum: string, episodeNum: string): Observable<EpisodeDetails> {
    return this._HttpClient.get(
      `${this.baseUrl}/tv/${tvId}/season/${seasonNum}/episode/${episodeNum}`
    );
  }
}
