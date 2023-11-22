import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { TaxController } from './tax.controller';
import { TaxService } from './tax.service';
import { TaxEntity } from './entity/tax.entity';
import { CountryService } from '../country/country.service';
import { CountryEntity } from '../country/entity/country.entity';
import { CountryModule } from '../country/country.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaxEntity, UserEntity,]),
    forwardRef(() => CountryModule),
    forwardRef(() => UserModule),
  ],
  controllers: [TaxController],
  providers: [TaxService,
    UserService,
    EmailService,]
})
export class TaxModule { }
