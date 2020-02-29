import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Event, EVENTS, SetListItemDefinition, Song, SONGS } from '../../../data'
import { flatten } from 'lodash-es'
import { SongsService } from '../songs.service'

type EventForList = Event & { live_house_name?: string }

@Component({
  selector: 'app-songs-detail',
  templateUrl: './songs-detail.component.html',
  styleUrls: ['./songs-detail.component.sass']
})
export class SongsDetailComponent implements OnInit {

  private id: number

  song: Song

  relatedLives: EventForList[] = []

  constructor (
    private songs: SongsService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit (): void {
    this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = Number(params['id'])
      }
      this.song = this.songs.getSongById(this.id)
      this.relatedLives = this.songs.getRelatedLives(this.id)
    })
  }
}
