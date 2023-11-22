import { Body, Controller, HttpCode, Get, Post, Put, UsePipes, ValidationPipe, UseGuards, Request, Param, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Roles, Boolean } from 'src/enums/enum';
import { Role } from "../../middleware/decorator/role.decorator";
import { AuthGuard } from 'src/middleware/authGuard.service';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/addToCart.dto';
import { DeleteFromCartDto } from './dto/deleteFromCart.dto';

@Controller('cart')
@ApiTags('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/add')
    @ApiOperation({ summary: "add item to cart" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async addToCart(@Request() req, @Body() data: AddToCartDto): Promise<any> {
        const userId = req.user.id;
        return await this.cartService.addToCart(userId, data);
    }

    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/delete')
    @ApiOperation({ summary: "delete item from cart" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async deleteFromCart(@Request() req, @Body() data: DeleteFromCartDto): Promise<any> {
        const userId = req.user.id;
        return await this.cartService.deleteFromCart(userId, data);
    }

    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/clear')
    @ApiOperation({ summary: "clear customer cart" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async clearCart(@Request() req): Promise<any> {
        const userId = req.user.id;
        return await this.cartService.clearCart(userId);
    }

    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/list')
    @ApiOperation({ summary: "get list of cart items" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async listCartItems(@Request() req): Promise<any> {
        const userId = req.user.id;
        return await this.cartService.listCartItems(userId);
    }
}
