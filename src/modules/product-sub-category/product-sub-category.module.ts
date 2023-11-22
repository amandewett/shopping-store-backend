import { Module } from '@nestjs/common';
import { ProductSubCategoryController } from './product-sub-category.controller';
import { ProductSubCategoryService } from './product-sub-category.service';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { ProductSubCategoryEntity } from './entity/productSubCategory.entity';
import { CountryService } from '../country/country.service';
import { CountryEntity } from '../country/entity/country.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductSubCategoryEntity, UserEntity, CountryEntity,]),
    UserModule,
  ],
  controllers: [
    ProductSubCategoryController
  ],
  providers: [
    ProductSubCategoryService,
    UserService,
    EmailService,
    CountryService,
  ]
})
export class ProductSubCategoryModule { }
