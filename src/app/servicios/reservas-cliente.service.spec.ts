import { TestBed } from '@angular/core/testing';

import { ReservasClienteService } from './reservas-cliente.service';

describe('ReservasClienteService', () => {
  let service: ReservasClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservasClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
