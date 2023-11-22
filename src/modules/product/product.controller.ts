import { Body, Controller, HttpCode, Get, Post, Put, UsePipes, ValidationPipe, UseGuards, Request, Param, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Roles, Boolean } from 'src/enums/enum';
import { Role } from "../../middleware/decorator/role.decorator";
import { AuthGuard } from 'src/middleware/authGuard.service';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { SortDto } from '../shared/dto/sort.dto';
import { CountryService } from '../country/country.service';

@Controller('product')
@ApiTags('product')
export class ProductController {
    constructor(private readonly productService: ProductService,
    ) { }

    @Role(Roles.SuperAdmin, Roles.Admin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/create')
    @ApiOperation({ summary: "create new product" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async createProduct(@Request() req, @Body() data: CreateProductDto): Promise<any> {
        const userId = req.user.id;
        const role = req.user.role;
        const countryId = req.user.countryId;
        return await this.productService.createProduct(userId, role, countryId, data);
    }

    @Role(Roles.SuperAdmin, Roles.Admin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/update')
    @ApiOperation({ summary: "update product" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateProduct(@Request() req, @Body() data: UpdateProductDto): Promise<any> {
        const userId = req.user.id;
        return await this.productService.updateProduct(userId, data);
    }

    @Role(Roles.SuperAdmin, Roles.Admin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/staff/list/:keyword?')
    @ApiOperation({ summary: "product staff list" })
    @ApiParam({ name: 'keyword', required: false })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async productStaffList(@Request() req, @Body() data: SortDto, @Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Param('keyword') keyword?: string): Promise<any> {
        const role = req.user.role;
        const countryId = req.user.countryId;
        return await this.productService.productStaffList(+pageNumber, +limit, keyword, role, countryId, data);
    }

    @Get('/list/:countryId/:keyword?')
    @ApiOperation({ summary: "products list" })
    @ApiParam({ name: 'keyword', required: false })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async productList(@Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Param('countryId') countryId: number, @Param('keyword') keyword?: string): Promise<any> {
        return await this.productService.productList(+pageNumber, +limit, keyword, countryId);
    }

    @Get('/featuredList/:countryId')
    @ApiOperation({ summary: "featured products list" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async featuredProductList(@Param('countryId') countryId: number): Promise<any> {
        return await this.productService.featuredProductList(countryId);
    }

    @Get('/newArrivalList/:countryId')
    @ApiOperation({ summary: "new arrival products list" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async newArrivalProductList(@Param('countryId') countryId: number): Promise<any> {
        return await this.productService.newArrivalProductList(countryId);
    }

    @Get('/packageList/:countryId')
    @ApiOperation({ summary: "package products list" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async packageProductList(@Param('countryId') countryId: number): Promise<any> {
        return await this.productService.packageProductList(countryId);
    }

    @Get('/listByCategory/:countryId/:categoryId/:keyword?')
    @ApiOperation({ summary: "get products by category" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async getProductListByCategory(@Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Param('countryId') countryId: number, @Param('categoryId') categoryId: number, @Param('keyword') keyword?: string): Promise<any> {
        return await this.productService.productListByCategory(+pageNumber, +limit, countryId, categoryId, keyword);
    }

    @Get('/shopList/:countryId/:keyword?')
    @ApiOperation({ summary: "get product list for shop" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async getProductListForShop(@Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Param('countryId') countryId: number, @Param('keyword') keyword?: string): Promise<any> {
        return await this.productService.shopProductList(+pageNumber, +limit, countryId, keyword);
    }

    @Get('/details/:id')
    @ApiOperation({ summary: "products details" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async productDetails(@Param('id') id: number): Promise<any> {
        return await this.productService.productDetails(id);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/staff/manage/:id/:isActive')
    @ApiOperation({ summary: "manage product active status" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async manageProductActiveStatus(@Request() req, @Param('id') id: number, @Param('isActive') isActive: number): Promise<any> {
        const userId = req.user.id;
        return await this.productService.manageProductActiveStatus(userId, +id, +isActive);
    }
}
