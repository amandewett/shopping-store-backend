import { Module, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { CouponEntity } from './entity/coupon.entity';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CountryEntity } from '../country/entity/country.entity';
import { CountryService } from '../country/country.service';
import { CountryModule } from '../country/country.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CouponEntity, UserEntity]),
    forwardRef(() => CountryModule),
    forwardRef(() => UserModule),
  ],
  controllers: [CouponController],
  providers: [CouponService,
    UserService,
    EmailService,]
})
export class CouponModule { }
