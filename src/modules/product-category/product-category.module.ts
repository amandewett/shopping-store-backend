import { Module, forwardRef } from '@nestjs/common';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoryEntity } from './entity/productCategory.entity';
import { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { ProductSubCategoryService } from '../product-sub-category/product-sub-category.service';
import { ProductSubCategoryEntity } from '../product-sub-category/entity/productSubCategory.entity';
import { ProductEntity } from '../product/entity/product.entity';
import { UserModule } from '../user/user.module';
import { ProductSubCategoryModule } from '../product-sub-category/product-sub-category.module';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';
import { CountryModule } from '../country/country.module';
import { CountryService } from '../country/country.service';
import { CountryEntity } from '../country/entity/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        ProductCategoryEntity,
        ProductEntity,
        ProductSubCategoryEntity,
        CountryEntity,
        UserEntity,
      ]
    ),
    forwardRef(() => UserModule),
    forwardRef(() => ProductSubCategoryModule),
    forwardRef(() => ProductModule),
    forwardRef(() => CountryModule),
  ],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService, ProductService, ProductSubCategoryService, CountryService,
    UserService,
    EmailService,]
})
export class ProductCategoryModule { }
