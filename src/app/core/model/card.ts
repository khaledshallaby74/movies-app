export interface Card {
    adult:boolean
}
export interface CardArray {
    adult?:boolean,
    backdrop_path?:string,
    genre_ids?:number[],
    id:number,
    name:string,
    media_type?:string,
    original_language?:string,
    original_title?:string,
    overview?:string,
    popularity?:number,
    poster_path?:string,
    profile_path?:string,
    release_date?:string,
    title?:string,
    video?:boolean,
    vote_average?:number,
    vote_count?:number,
}
