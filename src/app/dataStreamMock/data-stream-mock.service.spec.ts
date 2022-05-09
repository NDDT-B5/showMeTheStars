import { TestBed } from '@angular/core/testing';

import { DataStreamMockService } from './data-stream-mock.service';

describe('DataStreamMockService', () => {
  let service: DataStreamMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataStreamMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
