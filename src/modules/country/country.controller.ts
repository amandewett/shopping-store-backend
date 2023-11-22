import { Body, Controller, HttpCode, Get, Post, Put, UsePipes, ValidationPipe, UseGuards, Request, Param, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/enums/enum';
import { Role } from "../../middleware/decorator/role.decorator";
import { AuthGuard } from 'src/middleware/authGuard.service';
import { CountryService } from "./country.service";
import { AddCountryDto } from './dto/addCountry.dto';
import { UpdateCountryDto } from './dto/updateCountry.dto';

@Controller('country')
@ApiTags('country')
export class CountryController {
    constructor(private readonly countryService: CountryService) { }

    @Get('/all/:keyword?')
    @ApiOperation({ summary: "get all world countries list" })
    @ApiParam({ name: 'keyword', required: false })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async getAllCountries(@Param('keyword') keyword?: string): Promise<any> {
        return await this.countryService.getAllCountries(keyword);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/add')
    @ApiOperation({ summary: "add new country" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async addNewCountry(@Body() data: AddCountryDto): Promise<any> {
        return await this.countryService.addNewCountry(data);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Put('/update')
    @ApiOperation({ summary: "update new country" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateCountry(@Body() data: UpdateCountryDto): Promise<any> {
        return await this.countryService.updateCountry(data);
    }

    @Get('/list')
    @ApiOperation({ summary: "list of all added countries" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async listCountries(): Promise<any> {
        return await this.countryService.listActiveCountries();
    }

    @Get('/listApp')
    @ApiOperation({ summary: "list of all added countries for application" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async listCountriesForApp(): Promise<any> {
        return await this.countryService.listActiveCountriesForMobileApp();
    }

    @Get('/details/:id')
    @ApiOperation({ summary: "get details of country" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async countryDetails(@Param('id') id: number): Promise<any> {
        return await this.countryService.activeCountryDetails(+id);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/delete/:id')
    @ApiOperation({ summary: "delete the country" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async deleteCountry(@Param('id') id: number): Promise<any> {
        return await this.countryService.deleteCountry(+id);
    }
}
