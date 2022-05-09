import { Injectable } from '@angular/core';
import { interval, map } from 'rxjs';

/**
 * model for one discovered star
 */
 export interface SpottedStar {
  value: string;
  key: string;
  timestamp: number;
}

/**
 * mocking the data of discovered stars
 */
@Injectable({
  providedIn: 'root'
})
export class DataStreamMockService {
 /**
   * sets the wait time between each two
   * emitted data sets in ms
   */
  private intervalLength = 500;

  /**
   * Generates a stream of mocked star data
   * with a new array of discovered stars every 500ms
   *
   * the discovery of the stars has a timestamp
   *
   * as all of the records are created almost instantly,
   * new Date().getTime() does not create much variance
   *
   * to get some variance into that timestamp the "discovery" is
   * stretched over the 500ms with an additional randomizer
   *
   * all of the discovered stars have to be in the past timeInterval
   */
  public source= interval(this.intervalLength).pipe(
    map((t: number) => {
      const countOfNewStars = Math.random() * 1000;
      const currentTimeStamp = new Date().getTime();
      const listOfNewStars: SpottedStar[] = Array.from({length: countOfNewStars}, (_, index) => {
        return {
          value: "my-value" + t + '-' + index,
          key: "my-key" + t + '-' + index,
          timestamp: Math.floor(currentTimeStamp - Math.random() * (this.intervalLength - 1) - 1)
        };
      })
      listOfNewStars.sort((s1: SpottedStar, s2: SpottedStar)=> s1.timestamp - s2.timestamp);
      return {data: listOfNewStars};
    })
  );
}
