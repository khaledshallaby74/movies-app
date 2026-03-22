// =================== Card & Media ===================
export interface Card {
  adult?: boolean;
}

export interface CardArray {
  adult?: boolean;
  backdrop_path?: string;
  genre_ids?: number[];
  id: number;
  name?: string;               // used for TV shows
  media_type?: string;          // movie | tv | person | ...
  original_language?: string;
  original_title?: string;      // used for movies
  overview?: string;
  popularity?: number;
  poster_path?: string;
  profile_path?: string;        // used for person
  release_date?: string;        // movies
  title?: string;               // movies
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
  isFav?: boolean;
  isHover?: boolean;
}

// =================== Filters ===================
export interface Filters {
  search?: string;
  genre?: string[] | number[];   // number[] is TMDB genre_ids
  year?: string[] | number[];
  language?: string[];
  country?: string[];
  page?: number;
  category?: string;
  media_type?: string | null;
}

// =================== TMDB Genre ===================
export interface Genre {
  id?: number;
  name?: string;
}
  // TMDB always returns "genres" array
export interface GenreListResponse {
  genres?: Genre[];      
}

// =================== TMDB Configuration ===================
export interface Country {
  iso_3166_1?: string;
  english_name?: string;
  native_name?: string;
}

export interface Language {
  iso_639_1?: string;
  english_name?: string;
  name?: string;
}


// =================== Discover / Search Responses ===================
export interface DiscoverResponse {
  results?: CardArray[];        // search/multi
  total_pages?: number;

  movies?: {
    results?: CardArray[];
    total_pages?: number;
  };
  tv?: {
    results?: CardArray[];
    total_pages?: number;
  };
}

// =================== Merged Movies + TV ===================
export interface MergedMedia {
  movies?: { results?: CardArray[]; total_pages?: number };
  tv?: { results?: CardArray[]; total_pages?: number };
}

// ===================  Single movie or TV show details  ===================
export interface MediaDetails {
  id?: number;
  title?: string;            
  name?: string;             
  original_title?: string;
  original_name?: string;
  overview?: string;
  genres?: Genre[];
  release_date?: string;     
  first_air_date?: string;   
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  vote_count?: number;
  adult?: boolean;
  [key: string]: any;       
}
// =================== Single season details for TV show  ===================
export interface SeasonDetails {
  id?: number;
  name?: string;
  overview?: string;
  season_number?: number;
  air_date?: string;
  poster_path?: string;
  episodes?: EpisodeDetails[];
}
// ===================  Single episode details for TV show  ===================

export interface EpisodeDetails {
  id?: number;
  name?: string;
  overview?: string;
  episode_number?: number;
  season_number?: number;
  air_date?: string;
  still_path?: string;
  vote_average?: number;
  vote_count?: number;
}