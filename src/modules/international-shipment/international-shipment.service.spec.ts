import { Test, TestingModule } from '@nestjs/testing';
import { InternationalShipmentService } from './international-shipment.service';

describe('InternationalShipmentService', () => {
  let service: InternationalShipmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InternationalShipmentService],
    }).compile();

    service = module.get<InternationalShipmentService>(InternationalShipmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
