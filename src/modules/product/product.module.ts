import { Module, forwardRef } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { ProductEntity } from './entity/product.entity';
import { ProductSubCategoryService } from '../product-sub-category/product-sub-category.service';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSubCategoryEntity } from '../product-sub-category/entity/productSubCategory.entity';
import { ProductCategoryEntity } from '../product-category/entity/productCategory.entity';
import { CountryEntity } from '../country/entity/country.entity';
import { CountryService } from '../country/country.service';
import { CountryModule } from '../country/country.module';
import { ProductSubCategoryModule } from '../product-sub-category/product-sub-category.module';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, CountryEntity, ProductCategoryEntity, ProductSubCategoryEntity, UserEntity,]),
    forwardRef(() => UserModule),
    forwardRef(() => CountryModule),
    forwardRef(() => ProductSubCategoryModule),
    forwardRef(() => ProductCategoryModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, CountryService, ProductCategoryService, ProductSubCategoryService,
    UserService,
    EmailService,]
})
export class ProductModule { }
