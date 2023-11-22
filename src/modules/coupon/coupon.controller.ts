import { Body, Controller, HttpCode, Get, Post, Put, UsePipes, ValidationPipe, UseGuards, Request, Param, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Roles, Boolean, CouponType } from 'src/enums/enum';
import { Role } from "../../middleware/decorator/role.decorator";
import { AuthGuard } from 'src/middleware/authGuard.service';
import { CouponService } from './coupon.service';
import { AddCouponDto } from './dto/addCoupon.dto';
import { UpdateCouponDto } from './dto/updateCoupon.dto';

@Controller('coupon')
@ApiTags('coupon')
export class CouponController {
    constructor(private readonly couponService: CouponService) { }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/create')
    @ApiOperation({ summary: "create a new coupon" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async createCoupon(@Request() req, @Body() data: AddCouponDto): Promise<any> {
        return await this.couponService.createNewCoupon(data);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/update')
    @ApiOperation({ summary: "update coupon" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateCoupon(@Request() req, @Body() data: UpdateCouponDto): Promise<any> {
        return await this.couponService.updateCoupon(data);
    }


    @Get('/list/:countryId?')
    @ApiOperation({ summary: "monthly discount coupon list" })
    @ApiParam({ name: 'countryId', required: false })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async couponList(@Query('couponType') couponType?: number, @Param('countryId') countryId?: number): Promise<any> {
        return await this.couponService.listCoupons(couponType, countryId);
    }

    @Get('/couponDetails/:couponCode')
    @ApiOperation({ summary: "coupon details from coupon code" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async couponDetailsByCouponCode(@Param('couponCode') couponCode: string): Promise<any> {
        return await this.couponService.couponDetailsCouponCode(couponCode);
    }

    @Get('/details/:id')
    @ApiOperation({ summary: "coupon details" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async couponDetails(@Param('id') couponId: number): Promise<any> {
        return await this.couponService.couponDetails(couponId);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/delete/:id')
    @ApiOperation({ summary: "delete coupons" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async deleteCoupon(@Param('id') couponId: number): Promise<any> {
        return await this.couponService.deleteCoupon(couponId);
    }
}
