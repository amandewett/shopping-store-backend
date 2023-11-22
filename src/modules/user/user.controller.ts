import { Body, Controller, HttpCode, Get, Post, UsePipes, ValidationPipe, UseGuards, Request, Param, ParseIntPipe, Query, DefaultValuePipe, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AccountVerificationDto } from './dto/accountVerification.dto';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { Roles } from 'src/enums/enum';
import { Role } from "../../middleware/decorator/role.decorator";
import { AuthGuard } from 'src/middleware/authGuard.service';
import { RegisterStaffDto } from './dto/registerStaff.dto';
import { UpdateStaffRightsDto } from './dto/updateStaffRights.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ChangeStaffPasswordDto } from './dto/changeStaffPassword.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { UpdateStaffUserDto } from './dto/updateStaffUser.dto';
import { SortDto } from '../shared/dto/sort.dto';

@ApiTags('user')
@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get('/registerGuest/:countryId')
    @ApiOperation({ summary: "Register new guest user" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async registerGuestUser(@Param('countryId') countryId: number): Promise<any> {
        return await this.userService.registerGuestUser(countryId);
    }

    @Post('/register')
    @ApiOperation({ summary: "Register new user and social logins" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async registerUser(@Body() registerUserData: RegisterUserDto): Promise<any> {
        return await this.userService.registerUser(registerUserData);
    }

    @Post('/login')
    @ApiOperation({ summary: "User login" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async login(@Body() loginDtoData: LoginDto): Promise<any> {
        return await this.userService.login(loginDtoData);
    }

    @Post('/verify')
    @ApiOperation({ summary: "Account verification" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async accountVerification(@Body() accountVerificationDtoData: AccountVerificationDto): Promise<any> {
        return await this.userService.verifyAccount(accountVerificationDtoData);
    }

    @Post('/resendOtp')
    @ApiOperation({ summary: "Resend account verification OTP" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async resendAccountVerificationOtp(@Body() data: ResendOtpDto): Promise<any> {
        return await this.userService.resendOtp(data);
    }

    @Post('/forgotPassword')
    @ApiOperation({ summary: "Get otp for forgot password" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async forgotPassword(@Body() data: ResendOtpDto): Promise<any> {
        return await this.userService.forgotPasswordSendOtp(data);
    }

    @Post('/verifyForgotPasswordOtp')
    @ApiOperation({ summary: "Verify otp for forgot password" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async verifyForgotPasswordOtp(@Body() data: AccountVerificationDto): Promise<any> {
        return await this.userService.verifyForgotPasswordOtp(data);
    }

    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/resetPassword')
    @ApiOperation({ summary: "reset password" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async resetPassword(@Request() req, @Body() data: ResetPasswordDto): Promise<any> {
        const userId = req.user.id;
        return await this.userService.resetPassword(userId, data);
    }

    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/details')
    @ApiOperation({ summary: "get user details" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async getUserDetails(@Request() req): Promise<any> {
        const userId = req.user.id;
        return await this.userService.getUserDetails(userId);
    }

    @Role(Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Put('/update')
    @ApiOperation({ summary: "update user profile" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateUserDetails(@Request() req, @Body() data: UpdateProfileDto): Promise<any> {
        const userId = req.user.id;
        return await this.userService.updateUserDetails(userId, data);
    }

    @Role(Roles.SuperAdmin, Roles.Customer)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/changePassword')
    @ApiOperation({ summary: "change customer and super admin password" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async changePassword(@Request() req, @Body() data: ChangePasswordDto): Promise<any> {
        const userId = req.user.id;
        return await this.userService.updateCustomerPassword(userId, data);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/staff/create')
    @ApiOperation({ summary: "create new admin/sales manager" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async createStaffUser(@Body() data: RegisterStaffDto): Promise<any> {
        return await this.userService.createStaffUser(data);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/staff/update')
    @ApiOperation({ summary: "update admin/sales manager" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateStaffUser(@Body() data: UpdateStaffUserDto): Promise<any> {
        return await this.userService.updateStaffUser(data);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/staff/updateRights')
    @ApiOperation({ summary: "update staff rights" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateStaffRights(@Body() data: UpdateStaffRightsDto): Promise<any> {
        return await this.userService.updateStaffRights(data);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/staff/changePassword')
    @ApiOperation({ summary: "update staff password" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateStaffPassword(@Body() data: ChangeStaffPasswordDto): Promise<any> {
        return await this.userService.updateStaffPassword(data);
    }

    @Role(Roles.SuperAdmin, Roles.Admin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/staff/list/:keyword?')
    @ApiOperation({ summary: "get all user list for staff" })
    @ApiParam({ name: 'keyword', required: false })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async getAllUsersList(@Request() req, @Body() data: SortDto, @Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Param('keyword') keyword?: string): Promise<any> {
        const userId = req.user.id;
        const role = req.user.role;
        const countryId = req.user.countryId;
        return await this.userService.allUsersList(+pageNumber, +limit, keyword, userId, role, countryId, data);
    }

    @Role(Roles.SuperAdmin, Roles.Admin, Roles.SalesManager)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/staff/details/:userId')
    @ApiOperation({ summary: "get user details for staff" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async getUserDetailsForAdmin(@Request() req, @Param('userId', ParseIntPipe) userId: number): Promise<any> {
        return await this.userService.getUserDetails(userId);
    }

    @Role(Roles.SuperAdmin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/staff/manage/:userId/:isActive')
    @ApiOperation({ summary: "activate/de-activate user" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async manageUser(@Request() req, @Param('userId', ParseIntPipe) userId: number, @Param('isActive', ParseIntPipe) isActive: number): Promise<any> {
        return await this.userService.manageUser(userId, isActive);
    }

    @Role(Roles.SuperAdmin, Roles.Admin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/staff/order/list/:keyword?')
    @ApiOperation({ summary: "get all user list for order filters" })
    @ApiParam({ name: 'keyword', required: false })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async getAllUsersListForOrders(@Request() req, @Body() data: SortDto, @Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Param('keyword') keyword?: string): Promise<any> {
        const userId = req.user.id;
        const role = req.user.role;
        const countryId = req.user.countryId;
        return await this.userService.allUsersListForOrders(+pageNumber, +limit, keyword, userId, role, countryId, data);
    }
}
