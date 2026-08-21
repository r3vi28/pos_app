import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { VentasService } from './ventas';

describe('VentasService', () => {
  let service: VentasService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(VentasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
