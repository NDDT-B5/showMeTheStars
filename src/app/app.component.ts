import { Component } from '@angular/core';
import { DataStreamMockService, SpottedStar } from './dataStreamMock/data-stream-mock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'showMeTheStars';

  newStars: SpottedStar[] = [];
  public timeDisplayed = 60000;
  public timePerBucket = 100;

  /**
   * Choices for displayed Timeframe
   */
  maxTimes = [
    {name: "halbe Minute", milliSeconds: 30000},
    {name: "1 Minute", milliSeconds: 60000},
    {name: "2 Minuten", milliSeconds: 120000}
  ]

  /**
   * Choices for Buchet-Sizes
   */
  timePerBucketSelections =  [
    {name: "100ms", milliSeconds: 100},
    {name: "200ms", milliSeconds: 200},
    {name: "halbe Sekunde", milliSeconds: 500},
    {name: "1 Sekunde", milliSeconds: 1000}
  ]

  /**
   * Subscribing to the MockDataStream
   */
  constructor(dsms: DataStreamMockService) {
    dsms.source.subscribe(stars => {
      this.newStars = stars.data;
    });
  }
}
