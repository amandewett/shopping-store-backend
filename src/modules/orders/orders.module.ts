import { Module, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { CountryEntity } from '../country/entity/country.entity';
import { CountryService } from '../country/country.service';
import { CountryModule } from '../country/country.module';
import { UserModule } from '../user/user.module';
import { StateEntity } from '../state/entity/state.entity';
import { StateModule } from '../state/state.module';
import { StateService } from '../state/state.service';
import { InternationalShipmentModule } from '../international-shipment/international-shipment.module';
import { InternationalShipmentEntity } from '../international-shipment/entity/internationalShipment.entity';
import { InternationalShipmentService } from '../international-shipment/international-shipment.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderEntity } from './entity/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, OrderEntity, CountryEntity, InternationalShipmentEntity,]),
    forwardRef(() => UserModule),
    forwardRef(() => CountryModule),
    forwardRef(() => InternationalShipmentModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, UserService, EmailService, CountryService, InternationalShipmentService,]
})
export class OrdersModule { }
