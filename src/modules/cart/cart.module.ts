import { Module, forwardRef } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { ProductEntity } from '../product/entity/product.entity';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { ProductService } from '../product/product.service';
import { CartEntity } from './entity/cart.entity';
import { ProductCategoryEntity } from '../product-category/entity/productCategory.entity';
import { ProductSubCategoryEntity } from '../product-sub-category/entity/productSubCategory.entity';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSubCategoryService } from '../product-sub-category/product-sub-category.service';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { ProductSubCategoryModule } from '../product-sub-category/product-sub-category.module';
import { CountryService } from '../country/country.service';
import { CountryEntity } from '../country/entity/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, ProductEntity, ProductCategoryEntity, ProductSubCategoryEntity, CountryEntity, UserEntity,]),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    forwardRef(() => ProductCategoryModule),
    forwardRef(() => ProductSubCategoryModule),
  ],
  controllers: [CartController],
  providers: [CartService, ProductService, ProductCategoryService, ProductSubCategoryService, CountryService,
    UserService,
    EmailService,]
})
export class CartModule { }
