import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarTravelChartComponent } from './star-travel-chart.component';

describe('StarTravelChartComponent', () => {
  let component: StarTravelChartComponent;
  let fixture: ComponentFixture<StarTravelChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarTravelChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarTravelChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
