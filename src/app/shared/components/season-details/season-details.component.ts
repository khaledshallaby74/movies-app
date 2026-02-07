import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/core/services/posts.service';

@Component({
  selector: 'app-season-details',
  templateUrl: './season-details.component.html',
  styleUrls: ['./season-details.component.scss']
})
export class SeasonDetailsComponent implements OnInit {
  seasonData: any = {};
  tvId: string = "";
  imgPrifix: string = "https://image.tmdb.org/t/p/w500";
  backdropPrifix: string = "https://image.tmdb.org/t/p/original";

  constructor(private _ActivatedRoute: ActivatedRoute, private _PostsService: PostsService) {}

  ngOnInit(): void {
    this.tvId = this._ActivatedRoute.snapshot.params['id'];
    const seasonNum = this._ActivatedRoute.snapshot.params['season_number'];

    this._PostsService.getSeasonDetails(this.tvId, seasonNum).subscribe({
      next: (res) => {
        this.seasonData = res;
        console.log("Season Data:", res);
      }
    });
  }
}