import { Injectable } from '@angular/core'
import { Event, EVENTS, PLACES, SetListItemDefinition, Song, SONGS } from '../../data'
import { flatten } from 'lodash-es'

export interface GetSongsOptions {
  removeInstrumental?: boolean
}

type EventForList = Event & { live_house_name?: string }

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  constructor () { }

  // Do something
  getSongById (id: number): Song | undefined {
    return SONGS.find(s => s.id === id)
  }

  getSongs (options: GetSongsOptions = {}) {
    return SONGS.filter(s => {
      const removeInst = Boolean(options.removeInstrumental)
      if (removeInst) { return !s.is_instrumental }
      return true
    })
  }

  getRelatedLives (songId: number): EventForList[] {
    return EVENTS.filter(event => {
      const flattened = flatten(event.songs)
      return flattened.some(item => {
        if (this.isSetListItemDefinition(item)) {
          if (!item.songs) return false
          return item.songs.some(so => {
            return so === songId
          })
        }
        return item === songId
      })
    }).map((ev: EventForList) => {
      return {
        ...ev,
        live_house_name: PLACES.find(p => p.id === ev.live_house)?.name
      }
    })
  }

  /**
   * User Defined Type Guard
   */
  private isSetListItemDefinition (arg: any): arg is SetListItemDefinition {
    return arg.songs !== undefined
  }

}
