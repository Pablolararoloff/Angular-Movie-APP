import { TestBed } from '@angular/core/testing';
import { FetchApiDataService } from './fetch-api-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Use HttpClientTestingModule for testing

describe('FetchApiDataService', () => {
  let service: FetchApiDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FetchApiDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
