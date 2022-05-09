import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { scaleBand, scaleLinear, scaleTime } from 'd3-scale';
import { brushX } from 'd3-brush';
import { select } from 'd3-selection';
import {
  BaseChartComponent,
  calculateViewDimensions,
  ColorHelper,
  id,
  ScaleType,
  ViewDimensions
} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-custom-bar-chart-timeline',
  templateUrl: './custom-bar-chart-timeline.component.html',
  styleUrls: ['./custom-bar-chart-timeline.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomBarChartTimelineComponent extends BaseChartComponent {

  @Input() autoScale = false;
  @Input() override schemeType: ScaleType = ScaleType.Ordinal;
  @Input() valueDomain!: number[];
  @Input() xAxis: any;
  @Input() yAxis: any;
  @Input() showXAxisLabel: any;
  @Input() showYAxisLabel: any;
  @Input() xAxisLabel: any;
  @Input() yAxisLabel: any;
  @Input() gradient: any;
  @Input() showGridLines: boolean = true;
  @Input() override animations: boolean = true;
  @Input() noBarWhenZero: boolean = true;

  @Output() onFilter = new EventEmitter();

  dims!: ViewDimensions;
  xSet: any;
  xDomain: any;
  yDomain: any;
  seriesDomain: any;
  yScale: any;
  xScale: any;
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  timeScale: any;
  colors!: ColorHelper;
  scaleType!: string;
  transform!: string;
  margin: any[] = [10, 20, 30, 20];
  initialized: boolean = false;
  filterId: any;
  filter: any;
  brush: any;


  override update(): void {
    super.update();
    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showXAxis: this.xAxis,
      showYAxis: this.yAxis,
      xAxisHeight: this.xAxisHeight,
      yAxisWidth: this.yAxisWidth,
      showXLabel: this.showXAxisLabel,
      showYLabel: this.showYAxisLabel,
      showLegend: false,
      legendType: this.schemeType
    });

    this.xDomain = this.getXDomain();

    this.yDomain = this.getYDomain();
    this.timeScale = this.getTimeScale(this.xDomain, this.dims.width);
    this.xScale = this.getXScale(this.xSet, this.dims.width);
    this.yScale = this.getYScale(this.yDomain, this.dims.height);

    this.setColors();
    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;

    if (this.brush) {
      this.updateBrush();
    }

    this.filterId = 'filter' + id().toString();
    this.filter = `url(#${this.filterId})`;

    if (!this.initialized) {
      this.addBrush();
      this.initialized = true;
    }
  }

  getXDomain(): any[] {
    const values: any = [];
    for (const d of this.results) {
      if (!values.includes(d.name)) {
        values.push(d.name);
      }
    }
    this.scaleType = this.getScaleType(values);
    let domain = [];
    const min = new Date(Math.min(...values));
    const max = new Date(Math.max(...values));
    domain = [min.getTime(), max.getTime()];
    this.xSet = values;
    return domain;
  }

  getYDomain(): any[] {
    if (this.valueDomain) {
      return this.valueDomain;
    }

    const domain = [];

    for (const d of this.results) {
      if (domain.indexOf(d.value) < 0) {
        domain.push(d.value);
      }
      if (d.min !== undefined) {
        if (domain.indexOf(d.min) < 0) {
          domain.push(d.min);
        }
      }
      if (d.max !== undefined) {
        if (domain.indexOf(d.max) < 0) {
          domain.push(d.max);
        }
      }
    }

    let min = Math.min(...domain);
    const max = Math.max(...domain);
    if (!this.autoScale) {
      min = Math.min(0, min);
    }

    return [min, max];
  }

  getXScale(domain: any, width: any): any {
    return scaleBand().range([0, width]).paddingInner(0).domain(domain);
  }

  getTimeScale(domain: any, width: any): any {
    return scaleTime().range([0, width]).domain(domain);
  }

  getYScale(domain: any, height: any): any {
    const scale = scaleLinear().range([height, 0]).domain(domain);

    return scale;
  }

  getScaleType(values: any): ScaleType {
    return ScaleType.Time;
  }

  trackBy(index: any, item: any): string {
    return `${item.name}`;
  }

  setColors(): void {
    let domain;
    if (this.schemeType === ScaleType.Ordinal) {
      domain = this.xSet;
    } else {
      domain = this.yDomain;
    }

    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  //@ts-ignore
  updateYAxisWidth({ width }): void {
    this.yAxisWidth = width;
    this.update();
  }

  //@ts-ignore
  updateXAxisHeight({ height }): void {
    this.xAxisHeight = height;
    this.update();
  }

  addBrush(): void {
    if (this.brush) return;

    const height = this.height;
    const width = this.width;

    this.brush = brushX()
      .extent([
        [0, 0],
        [width, height]
      ])
      .on('brush end', ({ selection }) => {
        const newSelection = selection || this.xScale.range();
        const newDomain = newSelection.map(this.timeScale.invert);

        this.onFilter.emit(newDomain);
        this.cd.markForCheck();
      });

    select(this.chartElement.nativeElement).select('.brush').call(this.brush);
  }

  updateBrush(): void {
    if (!this.brush) return;

    const height = this.dims.height;
    const width = this.dims.width;

    this.brush.extent([
      [0, 0],
      [width, height]
    ]);
    select(this.chartElement.nativeElement).select('.brush').call(this.brush);

    // clear hardcoded properties so they can be defined by CSS
    select(this.chartElement.nativeElement)
      .select('.selection')
      //@ts-ignore
      .attr('fill', undefined)
      //@ts-ignore
      .attr('stroke', undefined)
      //@ts-ignore
      .attr('fill-opacity', undefined);

    this.cd.markForCheck();
  }
}
