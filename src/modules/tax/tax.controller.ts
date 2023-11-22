import { Body, Controller, HttpCode, Get, Post, Put, UsePipes, ValidationPipe, UseGuards, Request, Param, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Roles, Boolean } from 'src/enums/enum';
import { Role } from "../../middleware/decorator/role.decorator";
import { AuthGuard } from 'src/middleware/authGuard.service';
import { TaxService } from './tax.service';
import { AddTaxDto } from './dto/addTax.dto';
import { UpdateTaxDto } from './dto/updateTax.dto';

@Controller('tax')
@ApiTags('tax')
export class TaxController {
    constructor(private readonly taxService: TaxService) { }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/add')
    @ApiOperation({ summary: "add a new tax" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async addTax(@Body() data: AddTaxDto): Promise<any> {
        return await this.taxService.addTax(data);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/update')
    @ApiOperation({ summary: "update tax" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateTax(@Body() data: UpdateTaxDto): Promise<any> {
        return await this.taxService.updateTax(data);
    }


    @Get('/list')
    @ApiOperation({ summary: "list of taxes" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async taxList(): Promise<any> {
        return await this.taxService.taxList();
    }

    @Get('/details/:id')
    @ApiOperation({ summary: "tax details by tax id" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async taxDetails(@Param('id') taxId: number): Promise<any> {
        return await this.taxService.taxDetails(taxId);
    }

    @Get('/detailsByCountryId/:countryId')
    @ApiOperation({ summary: "tax details by country id" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async taxDetailsByCountry(@Param('countryId') countryId: number): Promise<any> {
        return await this.taxService.taxDetailsByCountryId(countryId);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/delete/:id')
    @ApiOperation({ summary: "delete tax" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async deleteTax(@Param('id') taxId: number): Promise<any> {
        return await this.taxService.deleteTax(taxId);
    }
}
