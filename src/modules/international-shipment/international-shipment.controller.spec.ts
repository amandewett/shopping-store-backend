import { Test, TestingModule } from '@nestjs/testing';
import { InternationalShipmentController } from './international-shipment.controller';

describe('InternationalShipmentController', () => {
  let controller: InternationalShipmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternationalShipmentController],
    }).compile();

    controller = module.get<InternationalShipmentController>(InternationalShipmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
