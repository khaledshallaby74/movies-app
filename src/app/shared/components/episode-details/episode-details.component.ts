import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/core/services/posts.service';

@Component({
  selector: 'app-episode-details',
  templateUrl: './episode-details.component.html',
  styleUrls: ['./episode-details.component.scss']
})
export class EpisodeDetailsComponent implements OnInit {
  episode: any = {};
  tvId: any;
  seasonNum: any;
  imgPrifix: string = "https://image.tmdb.org/t/p/original"; // نستخدم Original لأعلى جودة

  constructor(private _ActivatedRoute: ActivatedRoute, private _PostsService: PostsService) {}

  ngOnInit(): void {
    // سحب البيانات من الـ URL
    this.tvId = this._ActivatedRoute.snapshot.params['id'];
    this.seasonNum = this._ActivatedRoute.snapshot.params['season_number'];
    const episodeNum = this._ActivatedRoute.snapshot.params['episode_number'];

    this._PostsService.getEpisodeDetails(this.tvId, this.seasonNum, episodeNum).subscribe({
      next: (res) => {
        this.episode = res;
      }
    });
  }
}