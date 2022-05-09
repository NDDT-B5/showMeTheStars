import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomBarChartTimelineComponent } from './custom-bar-chart-timeline.component';

describe('CustomBarChartTimelineComponent', () => {
  let component: CustomBarChartTimelineComponent;
  let fixture: ComponentFixture<CustomBarChartTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomBarChartTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomBarChartTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
