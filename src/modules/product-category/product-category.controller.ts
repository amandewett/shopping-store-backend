import { Body, Controller, HttpCode, Get, Post, Put, UsePipes, ValidationPipe, UseGuards, Request, Param, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/enums/enum';
import { Role } from "../../middleware/decorator/role.decorator";
import { AuthGuard } from 'src/middleware/authGuard.service';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/createProductCategory.dto';
import { UpdateProductCategoryDto } from './dto/updateProductCategory.dto';

@Controller('productCategory')
@ApiTags('productCategory')
export class ProductCategoryController {
    constructor(private readonly productCategoryService: ProductCategoryService) { }

    @Role(Roles.SuperAdmin, Roles.Admin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/create')
    @ApiOperation({ summary: "create product category" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async createProductCategory(@Request() req, @Body() data: CreateProductCategoryDto): Promise<any> {
        const userId = req.user.id;
        return await this.productCategoryService.createProductCategory(userId, data);
    }

    @Role(Roles.SuperAdmin, Roles.Admin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Put('/update')
    @ApiOperation({ summary: "update product category" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateProductCategory(@Request() req, @Body() data: UpdateProductCategoryDto): Promise<any> {
        const userId = req.user.id;
        return await this.productCategoryService.updateProductCategory(userId, data);
    }

    @Get('/list/:keyword?')
    @ApiOperation({ summary: "list of product category" })
    @ApiParam({ name: 'keyword', required: false })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async listProductCategory(@Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Param('keyword') keyword?: string): Promise<any> {
        return await this.productCategoryService.listProductCategory(+pageNumber, +limit, keyword);
    }

    @Role(Roles.SuperAdmin, Roles.Admin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/Staff/list/:keyword?')
    @ApiOperation({ summary: "list of product category" })
    @ApiParam({ name: 'keyword', required: false })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async listProductCategoryForStaff(@Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Param('keyword') keyword?: string): Promise<any> {
        return await this.productCategoryService.listProductCategoryForStaff(+pageNumber, +limit, keyword);
    }

    @Get('/featuredCategories')
    @ApiOperation({ summary: "list of featured product categories" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async listFeaturedProductCategory(): Promise<any> {
        return await this.productCategoryService.listFeaturedProductCategory();
    }

    @Get('/details/:id')
    @ApiOperation({ summary: "details of product category" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async detailsProductCategory(@Param('id') id: number): Promise<any> {
        return await this.productCategoryService.detailsProductCategory(id);
    }

    @Role(Roles.SuperAdmin, Roles.Admin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/delete/:id')
    @ApiOperation({ summary: "delete product category" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async deleteProductCategory(@Param('id') id: number): Promise<any> {
        return await this.productCategoryService.deleteProductCategory(id);
    }
}
