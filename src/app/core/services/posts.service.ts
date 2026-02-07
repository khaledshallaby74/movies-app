import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
Observable
@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private _HttpClient:HttpClient) { }
getAll(mediaType: string, pageNumber: number = 1): Observable<any> {
  return this._HttpClient.get(
    `https://api.themoviedb.org/3/trending/${mediaType}/day?api_key=dc9a62bb95e378a380ba794aa4e7fd7a&page=${pageNumber}`
  );
}
  getDetails(mediaType:string, id:string):Observable<any>{
    return this._HttpClient.get(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=dc9a62bb95e378a380ba794aa4e7fd7a`)
  }
  getSeasonDetails(tvId: string, seasonNumber: number): Observable<any> {
    return this._HttpClient.get(
      `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=dc9a62bb95e378a380ba794aa4e7fd7a`
    );
  }
  getEpisodeDetails(tvId: any, seasonNum: any, episodeNum: any): Observable<any> {
  return this._HttpClient.get(
    `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNum}/episode/${episodeNum}?api_key=dc9a62bb95e378a380ba794aa4e7fd7a`
  );
}
}
