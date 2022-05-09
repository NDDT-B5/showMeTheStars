import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomBarChartTimelineComponent } from './custom-bar-chart-timeline/custom-bar-chart-timeline.component';
import { StarTravelChartComponent } from './star-travel-chart/star-travel-chart.component';
import { NgxChartsModule }from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    CustomBarChartTimelineComponent,
    StarTravelChartComponent
  ],
  imports: [
    NgxChartsModule,
    CommonModule
  ],
  exports: [
    StarTravelChartComponent
  ]
})
export class TimeTravelSelectorModule { }
