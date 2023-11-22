import { Body, Controller, HttpCode, Get, Post, Put, UsePipes, ValidationPipe, UseGuards, Request, Param, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/enums/enum';
import { Role } from "../../middleware/decorator/role.decorator";
import { AuthGuard } from 'src/middleware/authGuard.service';
import { ProductSubCategoryService } from './product-sub-category.service';
import { CreateProductSubCategoryDto } from './dto/createProductSubCategory.dto';
import { UpdateProductSubCategoryDto } from './dto/updateProductSubCategory.sto';

@Controller('productSubCategory')
@ApiTags('productSubCategory')
export class ProductSubCategoryController {
    constructor(private readonly productSubCategoryService: ProductSubCategoryService) { }

    @Role(Roles.SuperAdmin, Roles.Admin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/create')
    @ApiOperation({ summary: "create product sub category" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async createProductSubCategory(@Request() req, @Body() data: CreateProductSubCategoryDto): Promise<any> {
        const userId = req.user.id;
        return await this.productSubCategoryService.createProductSubCategory(userId, data);
    }

    @Role(Roles.SuperAdmin, Roles.Admin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Put('/update')
    @ApiOperation({ summary: "update product sub category" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateProductSubCategory(@Request() req, @Body() data: UpdateProductSubCategoryDto): Promise<any> {
        const userId = req.user.id;
        return await this.productSubCategoryService.updateProductSubCategory(userId, data);
    }

    @Get('/list/:keyword?')
    @ApiOperation({ summary: "list of product sub category" })
    @ApiParam({ name: 'keyword', required: false })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async listProductSubCategory(@Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Param('keyword') keyword?: string): Promise<any> {
        return await this.productSubCategoryService.listProductSubCategory(+pageNumber, +limit, keyword);
    }

    @Role(Roles.SuperAdmin, Roles.Admin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/staff/list/:keyword?')
    @ApiOperation({ summary: "list of product sub category for staff" })
    @ApiParam({ name: 'keyword', required: false })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async listProductSubCategoryForStaff(@Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Param('keyword') keyword?: string): Promise<any> {
        return await this.productSubCategoryService.listProductSubCategoryForStaff(+pageNumber, +limit, keyword);
    }

    @Get('/details/:id')
    @ApiOperation({ summary: "details product sub category" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async detailsProductSubCategory(@Param('id') id: number): Promise<any> {
        return await this.productSubCategoryService.detailsProductSubCategory(+id);
    }
}
