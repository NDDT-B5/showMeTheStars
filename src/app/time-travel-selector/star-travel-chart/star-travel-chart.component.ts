import { Component, Input } from '@angular/core';
import { SpottedStar } from '../../dataStreamMock/data-stream-mock.service';

/**
 * DataType for one Bucket of Stars
 */
export interface StarDataBucket {
  stars: SpottedStar[];
  name: number;
  value: number;
}

/**
 * Displays the Timeline-BarChart
 */
@Component({
  selector: 'app-star-travel-chart',
  templateUrl: './star-travel-chart.component.html',
  styleUrls: ['./star-travel-chart.component.scss']
})
export class StarTravelChartComponent {

  showXAxis = true;
  startTime = 0;
  data: StarDataBucket[] = [];
  @Input() timeDisplayed = 60000;
  timePerBucket = 100;

  /**
   * Adding new data to the array
   */
 @Input() set newStars(stars: SpottedStar[]) {
    this.addDataToBuckets(stars);
    this.data = [...this.data];
  }


  @Input() set changeTimePerBucket(time: number) {
    if (time != this.timePerBucket && this.data.length > 0) {
      this.timePerBucket = time;
      let allStars = this.data.reduce((arr, bucket) => arr.concat(bucket.stars), [] as SpottedStar[]);
      this.data = [];
      const oldestStar = allStars[allStars.length - 1];
      let currentBucketTime = new Date().getTime();
      while (currentBucketTime > oldestStar.timestamp) {
        currentBucketTime = currentBucketTime - this.timePerBucket;
        let starsForThisBucket = allStars.filter(s => s.timestamp > currentBucketTime);
        this.data.push({
          stars: starsForThisBucket,
          name: currentBucketTime,
          value: starsForThisBucket.length
        });
        allStars = allStars.filter(s => s.timestamp <= currentBucketTime);
      }
    }

  }

  /**
   * Initializing data array
   */
  constructor() {
    this.data.push( {
      stars: [],
      name: new Date().getTime() + 1,
      value: 0
    });
  }

  /**
   * add a new batch of stars to the data array into
   * the appropriate buckets
   * @param stars list new found stars
   */
  public addDataToBuckets(stars: SpottedStar[]) {
    this.deleteAllDataOlderThanX();
    const currentTime = new Date().getTime();
    while (this.data[0].name + this.timePerBucket < currentTime) {
      this.data.unshift({
        stars: [],
        name: this.data[0].name + this.timePerBucket,
        value: 0
      });
    }
    let pos = 0;
    while (stars.length > 0) {
      this.data[pos].stars = stars.filter(s => s.timestamp > this.data[pos].name);
      this.data[pos].value = this.data[pos].stars.length;
      stars = stars.filter(s => s.timestamp <= this.data[pos].name);
      pos++;
    }
  }

  /**
   * deleting all Data that is not displayed anymore
   */
  public deleteAllDataOlderThanX(): void {
    const cutOffTime = new Date().getTime() - this.timeDisplayed;
    this.data = this.data.filter(b => b.name > cutOffTime);
  }

  /**
   * rearanging the Buckets when the bucketsize is changed
   */
  public timePerBuckedChanged() {
    let allStars = this.data.reduce((arr, bucket) => arr.concat(bucket.stars), [] as SpottedStar[]);
    this.data = [];
    const oldestStar = allStars[allStars.length - 1];
    let currentBucketTime = new Date().getTime();
    while (currentBucketTime > oldestStar.timestamp) {
      currentBucketTime = currentBucketTime - this.timePerBucket;
      let starsForThisBucket = allStars.filter(s => s.timestamp > currentBucketTime);
      this.data.push({
        stars: starsForThisBucket,
        name: currentBucketTime,
        value: starsForThisBucket.length
      });
      allStars = allStars.filter(s => s.timestamp <= currentBucketTime);
    }
  }

  /**
   * section of the timeline was clicked
   * @param event
   */
  onSelect(event: any) {
    console.log(event);
  }

}
