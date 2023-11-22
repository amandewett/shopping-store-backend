import { Module, forwardRef } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { CountryEntity } from './entity/country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';
import { EmailService } from '../email/email.service';
import { UserModule } from '../user/user.module';
import { EmailController } from '../email/email.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity, UserEntity]),
  forwardRef(() => UserModule),
  ],
  exports: [CountryService],
  controllers: [CountryController],
  providers: [
    CountryService,
    UserService,
    EmailService,
  ]
})
export class CountryModule { }
