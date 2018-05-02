import { TestBed, inject } from '@angular/core/testing';

import { Api } from './api';

describe('ApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Api]
    });
  });

  it('should be created', inject([Api], (service: Api) => {
    expect(service).toBeTruthy();
  }));
});
