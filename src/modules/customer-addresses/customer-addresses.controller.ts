import { Body, Controller, HttpCode, Get, Post, Put, UsePipes, ValidationPipe, UseGuards, Request, Param, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Roles, Boolean } from 'src/enums/enum';
import { Role } from "../../middleware/decorator/role.decorator";
import { AuthGuard } from 'src/middleware/authGuard.service';
import { CustomerAddressesService } from './customer-addresses.service';
import { AddCustomerAddressDto } from './dto/addCustomerAddresses.dto';
import { UpdateCustomerAddressDto } from './dto/updateCustomerAddresses.dto';

@Controller('customerAddresses')
@ApiTags('customerAddresses')
export class CustomerAddressesController {
    constructor(private readonly customerAddressesService: CustomerAddressesService) { }

    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/add')
    @ApiOperation({ summary: "add new address" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async addAddress(@Request() req, @Body() data: AddCustomerAddressDto): Promise<any> {
        const userId = req.user.id;
        return await this.customerAddressesService.addNewAddress(userId, data);
    }

    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/update')
    @ApiOperation({ summary: "update address" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateAddress(@Request() req, @Body() data: UpdateCustomerAddressDto): Promise<any> {
        const userId = req.user.id;
        return await this.customerAddressesService.updateAddress(userId, data);
    }

    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/setDefault/:id')
    @ApiOperation({ summary: "set default address" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async setDefaultAddress(@Request() req, @Param('id') id: number): Promise<any> {
        const userId = req.user.id;
        return await this.customerAddressesService.setDefaultAddress(userId, id);
    }

    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/list/:countryId')
    @ApiOperation({ summary: "customer addresses list with country id" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async addressList(@Request() req, @Param('countryId') countryId: number): Promise<any> {
        const userId = req.user.id;
        return await this.customerAddressesService.customerAddressList(userId, countryId);
    }

    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/details/:id')
    @ApiOperation({ summary: "customer address details" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async addressDetails(@Request() req, @Param('id') id: number): Promise<any> {
        const userId = req.user.id;
        return await this.customerAddressesService.customerAddressDetails(userId, id);
    }

    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/delete/:id')
    @ApiOperation({ summary: "customer address delete" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async addressDelete(@Request() req, @Param('id') id: number): Promise<any> {
        const userId = req.user.id;
        return await this.customerAddressesService.deleteCustomerDelete(userId, id);
    }
}
