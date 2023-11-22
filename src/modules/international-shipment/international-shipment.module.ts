import { Module, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { InternationalShipmentController } from './international-shipment.controller';
import { InternationalShipmentService } from './international-shipment.service';
import { InternationalShipmentEntity } from './entity/internationalShipment.entity';
import { UserModule } from '../user/user.module';
import { CountryEntity } from '../country/entity/country.entity';
import { CountryService } from '../country/country.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InternationalShipmentEntity, UserEntity, CountryEntity,]),
    forwardRef(() => UserModule),
  ],
  controllers: [InternationalShipmentController],
  providers: [InternationalShipmentService,
    UserService,
    EmailService, CountryService,]
})
export class InternationalShipmentModule { }
