import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { PostsService } from '../services/posts.service';

@Injectable({
  providedIn: 'root'
})
export class MediaTypeResolver implements Resolve<boolean> {

  constructor(private postsService: PostsService) {}

  resolve(route: ActivatedRouteSnapshot): boolean {
    const mediaType = route.data['media_type']; 

    this.postsService.filters$.next({
      ...this.postsService.filters$.value,
      media_type: mediaType,
      page: 1
    });

    return true;
  }
}