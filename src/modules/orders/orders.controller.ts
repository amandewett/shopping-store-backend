import { Body, Controller, HttpCode, Get, Post, Put, UsePipes, ValidationPipe, UseGuards, Request, Param, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Roles, Boolean } from 'src/enums/enum';
import { Role } from "../../middleware/decorator/role.decorator";
import { AuthGuard } from 'src/middleware/authGuard.service';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { OrderListDto } from './dto/orderList.dto';
import { ManageOrderDto } from './dto/manageOrder.dto';

@Controller('order')
@ApiTags('order')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) { }

    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/create')
    @ApiOperation({ summary: "create new order" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async createNewOrder(@Request() req, @Body() data: CreateOrderDto): Promise<any> {
        const userId = req.user.id;
        return await this.orderService.createOrder(userId, data);
    }

    @Get('/test')
    @ApiOperation({ summary: "create new order" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async test(): Promise<any> {
        return await this.orderService.testSoap();
    }


    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/update')
    @ApiOperation({ summary: "update order" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateOrder(@Request() req, @Body() data: UpdateOrderDto): Promise<any> {
        const userId = req.user.id;
        return await this.orderService.updateOrder(userId, data);
    }

    @Role(Roles.SuperAdmin, Roles.Admin, Roles.SalesManager)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/staff/list')
    @ApiOperation({ summary: "get order list for admin" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async getOrderListForStaff(@Request() req, @Body() data: OrderListDto, @Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number): Promise<any> {
        const userId = req.user.id;
        const role = req.user.role;
        const countryId = req.user.countryId;
        return await this.orderService.staffOrderList(userId, role, countryId, pageNumber, limit, data);
    }

    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/app/list')
    @ApiOperation({ summary: "get order list" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async getOrderList(@Request() req): Promise<any> {
        const userId = req.user.id;
        return await this.orderService.appOrderList(userId);
    }

    @Role(Roles.SuperAdmin, Roles.Admin, Roles.SalesManager, Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/details/:orderId')
    @ApiOperation({ summary: "get order details" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async getOrderDetails(@Request() req, @Param('orderId') orderId: number): Promise<any> {
        const userId = req.user.id;
        return await this.orderService.orderDetails(userId, orderId);
    }

    @Role(Roles.SuperAdmin, Roles.Admin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/manage')
    @ApiOperation({ summary: "manage order status" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async manageOrderStatus(@Request() req, @Body() data: ManageOrderDto): Promise<any> {
        const userId = req.user.id;
        const role = req.user.role;
        const countryId = req.user.countryId;
        return await this.orderService.manageOrder(userId, role, countryId, data);
    }

}
