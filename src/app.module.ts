import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typOrmConfig } from "./config/typeorm.config";
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { CountryModule } from './modules/country/country.module';
import { EmailModule } from './modules/email/email.module';
import { CountryService } from './modules/country/country.service';
import { CountryEntity } from './modules/country/entity/country.entity';
import { ProductSubCategoryModule } from './modules/product-sub-category/product-sub-category.module';
import { FileModule } from './modules/file/file.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { ProductModule } from './modules/product/product.module';
import { StateModule } from './modules/state/state.module';
import { CartModule } from './modules/cart/cart.module';
import { TaxModule } from './modules/tax/tax.module';
import { InternationalShipmentModule } from './modules/international-shipment/international-shipment.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { CustomerAddressesModule } from './modules/customer-addresses/customer-addresses.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot(typOrmConfig),
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', "public")
      }
    ),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRE_DURATION
      }
    }),
    TypeOrmModule.forFeature([CountryEntity]),
    UserModule,
    CountryModule,
    EmailModule,
    ProductSubCategoryModule,
    FileModule,
    ProductCategoryModule,
    ProductModule,
    StateModule,
    CartModule,
    TaxModule,
    InternationalShipmentModule,
    CouponModule,
    CustomerAddressesModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService, CountryService],
})
export class AppModule {
  constructor(private readonly countryService: CountryService) {
    //feed international country (category)
    this.countryService.addInternationalCountry();
  }
}
