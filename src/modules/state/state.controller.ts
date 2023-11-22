import { Body, Controller, HttpCode, Get, Post, Put, UsePipes, ValidationPipe, UseGuards, Request, Param, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/enums/enum';
import { Role } from "../../middleware/decorator/role.decorator";
import { AuthGuard } from 'src/middleware/authGuard.service';
import { StateService } from './state.service';
import { AddStateDto } from './dto/addState.dto';
import { UpdateStateDto } from './dto/updateState.dto';

@Controller('state')
@ApiTags('state')
export class StateController {
    constructor(private readonly stateService: StateService) { }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/add')
    @ApiOperation({ summary: "add new state" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async addNewState(@Request() req, @Body() data: AddStateDto): Promise<any> {
        const userId = req.user.id;
        return await this.stateService.addNewState(userId, data);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/update')
    @ApiOperation({ summary: "update state" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateNewState(@Request() req, @Body() data: UpdateStateDto): Promise<any> {
        const userId = req.user.id;
        return await this.stateService.updateState(userId, data);
    }

    @Role(Roles.SuperAdmin, Roles.Admin, Roles.SalesManager)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/staff/list/:countryId')
    @ApiOperation({ summary: "get state list for staff" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async staffStateList(@Param('countryId') countryId: number): Promise<any> {
        return await this.stateService.staffStateList(countryId);
    }

    @Get('/list/:countryId')
    @ApiOperation({ summary: "get state list for customers" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async stateList(@Param('countryId') countryId: number): Promise<any> {
        return await this.stateService.stateList(countryId);
    }

    @Get('/details/:id')
    @ApiOperation({ summary: "get state details" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async stateDetails(@Param('id') id: number): Promise<any> {
        return await this.stateService.stateDetails(id);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/manage/:id/:isActive')
    @ApiOperation({ summary: "manage state active status" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async manageState(@Param('id') id: number, @Param('isActive') isActive: number): Promise<any> {
        return await this.stateService.manageState(id, isActive);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/delete/:id')
    @ApiOperation({ summary: "delete state" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async deleteState(@Param('id') id: number): Promise<any> {
        return await this.stateService.deleteState(id);
    }
}
