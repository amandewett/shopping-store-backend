import { Module, forwardRef } from '@nestjs/common';
import { StateController } from './state.controller';
import { StateService } from './state.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateEntity } from './entity/state.entity';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { UserEntity } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { CountryEntity } from '../country/entity/country.entity';
import { CountryService } from '../country/country.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StateEntity, UserEntity, CountryEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [StateController],
  providers: [StateService,
    UserService,
    EmailService, CountryService,]
})
export class StateModule { }
