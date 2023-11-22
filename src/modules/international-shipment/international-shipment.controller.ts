import { Body, Controller, HttpCode, Get, Post, Put, UsePipes, ValidationPipe, UseGuards, Request, Param, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Roles, Boolean } from 'src/enums/enum';
import { Role } from "../../middleware/decorator/role.decorator";
import { AuthGuard } from 'src/middleware/authGuard.service';
import { InternationalShipmentService } from './international-shipment.service';
import { AddInternationalShipmentDto } from './dto/addInternationalShipment.dto';
import { UpdateInternationalShipmentDto } from './dto/updateInternationalShipment.dto';

@Controller('internationalShipment')
@ApiTags('internationalShipment')
export class InternationalShipmentController {
    constructor(private readonly internationalShipmentService: InternationalShipmentService) { }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/add')
    @ApiOperation({ summary: "add a new international shipment" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async addInternationalShipment(@Request() req, @Body() data: AddInternationalShipmentDto): Promise<any> {
        return await this.internationalShipmentService.addInternationalShipment(data);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/update')
    @ApiOperation({ summary: "update international shipment" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateInternationalShipment(@Request() req, @Body() data: UpdateInternationalShipmentDto): Promise<any> {
        return await this.internationalShipmentService.updateInternationalShipment(data);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/list')
    @ApiOperation({ summary: "international shipment list" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async listInternationalShipment(): Promise<any> {
        return await this.internationalShipmentService.listInternationalShipment();
    }

    @Get('/customerList')
    @ApiOperation({ summary: "international shipment list for customers" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async listInternationalShipmentForCustomers(): Promise<any> {
        return await this.internationalShipmentService.listInternationalShipmentForCustomers();
    }

    @Get('/details/:id')
    @ApiOperation({ summary: "international shipment details" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async detailsInternationalShipment(@Param('id') id: number): Promise<any> {
        return await this.internationalShipmentService.detailsInternationalShipment(id);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/manage/:id')
    @ApiOperation({ summary: "manage international shipment active status" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async manageInternationalShipment(@Param('id') id: number): Promise<any> {
        return await this.internationalShipmentService.toggleInternationalShipment(id);
    }
}
