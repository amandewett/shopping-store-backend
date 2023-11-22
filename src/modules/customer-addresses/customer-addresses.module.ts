import { Module, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { CountryEntity } from '../country/entity/country.entity';
import { CountryService } from '../country/country.service';
import { CountryModule } from '../country/country.module';
import { UserModule } from '../user/user.module';
import { CustomerAddressesController } from './customer-addresses.controller';
import { CustomerAddressesService } from './customer-addresses.service';
import { CustomerAddressEntity } from './entity/customerAddresses.entity';
import { StateEntity } from '../state/entity/state.entity';
import { StateModule } from '../state/state.module';
import { StateService } from '../state/state.service';
import { InternationalShipmentModule } from '../international-shipment/international-shipment.module';
import { InternationalShipmentEntity } from '../international-shipment/entity/internationalShipment.entity';
import { InternationalShipmentService } from '../international-shipment/international-shipment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CustomerAddressEntity, CountryEntity, StateEntity, InternationalShipmentEntity,]),
    forwardRef(() => UserModule),
    forwardRef(() => CountryModule),
    forwardRef(() => StateModule),
    forwardRef(() => InternationalShipmentModule),
  ],
  controllers: [CustomerAddressesController],
  providers: [CustomerAddressesService, UserService, EmailService, CountryService, StateService, InternationalShipmentService,]
})
export class CustomerAddressesModule { }
