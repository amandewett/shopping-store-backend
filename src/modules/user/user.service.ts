import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UserEntity } from "./entity/user.entity";
import { Repository, IsNull, Like, Not } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Roles, RegistrationType, Boolean } from 'src/enums/enum';
import * as bCrypt from "bcrypt";
import * as randomString from "randomstring";
import { LoginDto } from './dto/login.dto';
import { AccountVerificationDto } from './dto/accountVerification.dto';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { RegisterStaffDto } from './dto/registerStaff.dto';
import { EmailService } from "../email/email.service";
import { UpdateStaffRightsDto } from './dto/updateStaffRights.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ChangeStaffPasswordDto } from './dto/changeStaffPassword.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { UpdateStaffUserDto } from './dto/updateStaffUser.dto';
import { SortDto } from '../shared/dto/sort.dto';
import { CountryService } from '../country/country.service';
import { CountryEntity } from '../country/entity/country.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private emailService: EmailService,
        @Inject(forwardRef(() => CountryService)) private countryServiceService: CountryService,
    ) { }

    registerGuestUser(countryId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let userObj = new UserEntity();

                userObj.countryId = countryId;
                userObj.registrationType = RegistrationType.Normal;
                userObj.role = Roles.Customer;

                let save = await this.userRepository.save(userObj);

                //create token
                const jwtToken = await this.jwtService.signAsync({
                    id: save.id,
                    role: save.role,
                });

                const userDetails = {
                    id: save.id,
                    role: save.role,
                    token: jwtToken,
                };

                resolve({
                    status: true,
                    isVerified: true,
                    message: `Login successful`,
                    result: userDetails
                });
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    registerUser(data: RegisterUserDto): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (data.id) {
                    const newOTP = this.generateOTP(4);

                    switch (data.registrationType) {
                        case RegistrationType.Normal: {
                            const user = await this.userRepository.findOneBy({
                                email: data.email,
                            });

                            if (user) {
                                resolve({
                                    status: false,
                                    message: `Email already exists`
                                });
                            }
                            else {
                                const userDetailsById = await this.userRepository.findOne({
                                    where: {
                                        id: data.id,
                                    }
                                });

                                const hasString: any = await this.hashString(data.password);
                                if (hasString.status) {
                                    userDetailsById.email = data.email;
                                    userDetailsById.firstName = data.firstName;
                                    userDetailsById.lastName = data.lastName;
                                    userDetailsById.phone = data.phone;
                                    userDetailsById.password = hasString.result;
                                    userDetailsById.registrationType = data.registrationType;
                                    userDetailsById.accountVerificationOtp = newOTP;
                                    userDetailsById.countryId = data.countryId;
                                    userDetailsById.accountVerificationTimeStamp = new Date(Date.now());

                                    let savedUser = await this.userRepository.save(userDetailsById);

                                    if (savedUser) {
                                        this.emailService.sendAccountVerificationOtp(savedUser.email, savedUser.firstName, newOTP);

                                        resolve({
                                            status: true,
                                            message: `Customer registration successful`
                                        });
                                    }
                                    else {
                                        resolve({
                                            status: false,
                                            message: 'Error in registration, please check server logs for more information.'
                                        });
                                    }
                                }
                                else {
                                    resolve(hasString);
                                }
                            }
                        }
                        case RegistrationType.Google: {
                            const user: UserEntity = await this.userRepository.findOneBy({
                                email: data.email,
                            });

                            if (user) {
                                //login customer
                                if (user.isActive == Boolean.True) {
                                    if (user.registrationType == RegistrationType.Google) {
                                        const jwtToken = await this.jwtService.signAsync({
                                            id: user.id,
                                            role: user.role,
                                        });

                                        const {
                                            password,
                                            accountVerificationTimeStamp,
                                            forgotPasswordTimeStamp,
                                            accountVerificationOtp,
                                            forgotPasswordOtp,
                                            ...result
                                        } = user;

                                        result['token'] = jwtToken;

                                        resolve({
                                            status: true,
                                            message: `Login successful`,
                                            result: result
                                        });
                                    }
                                    else {
                                        resolve({
                                            status: false,
                                            message: `Email already exist with another login type`
                                        });
                                    }
                                }
                                else {
                                    resolve({
                                        status: false,
                                        message: `Account blocked by admin`
                                    });
                                }
                            }
                            else {
                                const userDetailsById = await this.userRepository.findOne({
                                    where: {
                                        id: data.id,
                                    }
                                });
                                //register new account
                                userDetailsById.email = data.email;
                                userDetailsById.firstName = data.firstName;
                                userDetailsById.lastName = data.lastName;
                                userDetailsById.googleId = data.googleId;
                                userDetailsById.registrationType = data.registrationType;
                                userDetailsById.countryId = data.countryId;
                                userDetailsById.isVerified = Boolean.True;

                                let savedUser: UserEntity = await this.userRepository.save(userDetailsById);

                                if (savedUser) {
                                    const jwtToken = await this.jwtService.signAsync({
                                        id: savedUser.id,
                                        role: savedUser.role,
                                    });

                                    const {
                                        password,
                                        accountVerificationTimeStamp,
                                        forgotPasswordTimeStamp,
                                        accountVerificationOtp,
                                        forgotPasswordOtp,
                                        ...result
                                    } = savedUser;

                                    result['token'] = jwtToken;

                                    resolve({
                                        status: true,
                                        message: `Login successful`,
                                        result: result
                                    });
                                }
                                else {
                                    resolve({
                                        status: false,
                                        message: 'Error in registration, please check server logs for more information.'
                                    });
                                }
                            }
                        }
                        case RegistrationType.Facebook: {
                            let user: UserEntity = await this.userRepository.findOneBy({
                                facebookId: data.facebookId,
                            });

                            if (user) {
                                //login customer
                                if (user.isActive == Boolean.True) {
                                    if (user.registrationType == RegistrationType.Facebook) {
                                        const jwtToken = await this.jwtService.signAsync({
                                            id: user.id,
                                            role: user.role,
                                        });

                                        const {
                                            password,
                                            accountVerificationTimeStamp,
                                            forgotPasswordTimeStamp,
                                            accountVerificationOtp,
                                            forgotPasswordOtp,
                                            ...result
                                        } = user;

                                        result['token'] = jwtToken;

                                        resolve({
                                            status: true,
                                            message: `Login successful`,
                                            result: result
                                        });
                                    }
                                    else {
                                        resolve({
                                            status: false,
                                            message: `Email already exist with another login type`
                                        });
                                    }
                                }
                                else {
                                    resolve({
                                        status: false,
                                        message: `Account blocked by admin`
                                    });
                                }
                            }
                            else {
                                //register new account
                                const userDetailsById = await this.userRepository.findOne({
                                    where: {
                                        id: data.id,
                                    }
                                });

                                if (data.email) userDetailsById.email = data.email;
                                if (data.phone) userDetailsById.phone = data.phone;
                                userDetailsById.firstName = data.firstName;
                                userDetailsById.lastName = data.lastName;
                                userDetailsById.facebookId = data.facebookId;
                                userDetailsById.countryId = data.countryId;
                                userDetailsById.registrationType = data.registrationType;
                                userDetailsById.isVerified = Boolean.True;

                                let savedUser: UserEntity = await this.userRepository.save(userDetailsById);

                                if (savedUser) {
                                    const jwtToken = await this.jwtService.signAsync({
                                        id: savedUser.id,
                                        role: savedUser.role,
                                    });

                                    const {
                                        password,
                                        accountVerificationTimeStamp,
                                        forgotPasswordTimeStamp,
                                        accountVerificationOtp,
                                        forgotPasswordOtp,
                                        ...result
                                    } = savedUser;

                                    result['token'] = jwtToken;

                                    resolve({
                                        status: true,
                                        message: `Login successful`,
                                        result: result
                                    });
                                }
                                else {
                                    resolve({
                                        status: false,
                                        message: 'Error in registration, please check server logs for more information.'
                                    });
                                }
                            }

                        }
                        case RegistrationType.Apple: {
                            const user: UserEntity = await this.userRepository.findOneBy({
                                email: data.email,
                            });

                            if (user) {
                                //login customer
                                if (user.isActive == Boolean.True) {
                                    if (user.registrationType == RegistrationType.Apple) {
                                        const jwtToken = await this.jwtService.signAsync({
                                            id: user.id,
                                            role: user.role,
                                        });

                                        const {
                                            password,
                                            accountVerificationTimeStamp,
                                            forgotPasswordTimeStamp,
                                            accountVerificationOtp,
                                            forgotPasswordOtp,
                                            ...result
                                        } = user;

                                        result['token'] = jwtToken;

                                        resolve({
                                            status: true,
                                            message: `Login successful`,
                                            result: result
                                        });
                                    }
                                    else {
                                        resolve({
                                            status: false,
                                            message: `Email already exist with another login type`
                                        });
                                    }
                                }
                                else {
                                    resolve({
                                        status: false,
                                        message: `Account blocked by admin`
                                    });
                                }
                            }
                            else {
                                //register new account
                                const userDetailsById = await this.userRepository.findOne({
                                    where: {
                                        id: data.id,
                                    }
                                });
                                userDetailsById.email = data.email;
                                userDetailsById.firstName = data.firstName;
                                userDetailsById.lastName = data.lastName;
                                userDetailsById.appleId = data.appleId;
                                userDetailsById.countryId = data.countryId;
                                userDetailsById.registrationType = data.registrationType;
                                userDetailsById.isVerified = Boolean.True;

                                let savedUser: UserEntity = await this.userRepository.save(userDetailsById);

                                if (savedUser) {
                                    const jwtToken = await this.jwtService.signAsync({
                                        id: savedUser.id,
                                        role: savedUser.role,
                                    });

                                    const {
                                        password,
                                        accountVerificationTimeStamp,
                                        forgotPasswordTimeStamp,
                                        accountVerificationOtp,
                                        forgotPasswordOtp,
                                        ...result
                                    } = savedUser;

                                    result['token'] = jwtToken;

                                    resolve({
                                        status: true,
                                        message: `Login successful`,
                                        result: result
                                    });
                                }
                                else {
                                    resolve({
                                        status: false,
                                        message: 'Error in registration, please check server logs for more information.'
                                    });
                                }
                            }

                        }
                        default: {
                            resolve({
                                status: false,
                                message: `Unknown registration type!`
                            });
                        }
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Invalid user id`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    login(data: LoginDto): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const user = await this.userRepository.findOneBy({
                    email: data.email,
                });

                if (user) {
                    const isPasswordValid = await this.compareHashString(data.password, user.password);
                    if (isPasswordValid) {
                        if (user.isVerified == Boolean.True) {
                            if (user.isActive == Boolean.True) {
                                const jwtToken = await this.jwtService.signAsync({
                                    id: user.id,
                                    role: user.role,
                                });

                                const {
                                    password,
                                    accountVerificationTimeStamp,
                                    forgotPasswordTimeStamp,
                                    accountVerificationOtp,
                                    forgotPasswordOtp,
                                    ...result
                                } = user;

                                result['token'] = jwtToken;

                                resolve({
                                    status: true,
                                    isVerified: true,
                                    message: `Login successful`,
                                    result: result
                                });
                            }
                            else {
                                resolve({
                                    status: false,
                                    isVerified: true,
                                    message: `Account blocked by admin`
                                });
                            }
                        }
                        else {
                            resolve({
                                status: false,
                                isVerified: false,
                                message: `Please verify your account first`
                            });
                        }
                    }
                    else {
                        resolve({
                            status: false,
                            isVerified: true,
                            message: `Invalid credentials`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        isVerified: true,
                        message: `Invalid credentials`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    verifyAccount(data: AccountVerificationDto): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const user = await this.userRepository.findOneBy({
                    email: data.email,
                });

                if (user) {
                    if (data.otp == user.accountVerificationOtp) {
                        user.accountVerificationOtp = null;
                        user.isVerified = Boolean.True;
                        await this.userRepository.save(user);

                        resolve({
                            status: true,
                            message: `Account verified successfully`
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Invalid OTP`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `User doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    resendOtp(data: ResendOtpDto): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const user = await this.userRepository.findOneBy({
                    email: data.email,
                });

                if (user) {
                    if (user.accountVerificationOtp) {
                        this.emailService.sendAccountVerificationOtp(user.email, user.firstName, user.accountVerificationOtp);

                        resolve({
                            status: true,
                            message: `OTP sent successfully`
                        });
                    }
                    else {
                        const newOTP = this.generateOTP(4);
                        user.accountVerificationOtp = newOTP;
                        await this.userRepository.save(user);

                        this.emailService.sendAccountVerificationOtp(user.email, user.firstName, newOTP);

                        resolve({
                            status: true,
                            message: `OTP sent successfully`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `User doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    forgotPasswordSendOtp(data: ResendOtpDto): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const user = await this.userRepository.findOneBy({
                    email: data.email,
                    registrationType: RegistrationType.Normal
                });

                if (user) {
                    if (user.isVerified == Boolean.True) {
                        if (user.isActive == Boolean.False) {
                            resolve({
                                status: false,
                                message: `Account blocked by admin`
                            });
                        }
                        else {
                            const newOTP = this.generateOTP(4);
                            user.forgotPasswordOtp = newOTP;
                            await this.userRepository.save(user);

                            this.emailService.forgotPasswordOtp(user.email, user.firstName, newOTP);

                            resolve({
                                status: true,
                                message: `OTP sent to registered email`
                            });
                        }
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Please verify your account first`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `User doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    verifyForgotPasswordOtp(data: AccountVerificationDto): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const user = await this.userRepository.findOneBy({
                    email: data.email,
                });

                if (user) {
                    if (user.isVerified == Boolean.True) {
                        if (user.isActive == Boolean.False) {
                            resolve({
                                status: false,
                                message: `Account blocked by admin`
                            });
                        }
                        else {
                            if (data.otp == user.forgotPasswordOtp) {
                                user.forgotPasswordOtp = null;
                                await this.userRepository.save(user);

                                const jwtToken = await this.jwtService.signAsync({
                                    id: user.id,
                                    role: user.role,
                                });

                                resolve({
                                    status: true,
                                    token: jwtToken,
                                    message: `OTP verified`
                                });
                            }
                            else {
                                resolve({
                                    status: false,
                                    message: `Invalid OTP`
                                });
                            }
                        }
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Please verify your account first`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `User doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    resetPassword(userId: number, data: ResetPasswordDto): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const user = await this.userRepository.findOneBy({
                    id: userId
                });

                if (user) {
                    const hasString: any = await this.hashString(data.password);
                    if (hasString.status) {
                        user.password = hasString.result;
                        await this.userRepository.save(user);

                        resolve({
                            status: true,
                            message: `Password updated successfully`
                        });
                    }
                    else {
                        resolve(hasString);
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `User doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    getUserDetails(userId: number): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (userId) {
                    const user = await this.userRepository.findOneBy({
                        id: userId,
                    });

                    if (user) {
                        const {
                            password,
                            ...result
                        } = user;
                        resolve({
                            status: true,
                            result: result
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `User doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `User doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    updateUserDetails(userId: number, data: UpdateProfileDto): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (userId) {
                    const user = await this.userRepository.findOneBy({
                        id: userId,
                    });

                    if (user) {
                        user.firstName = data.firstName;
                        user.lastName = data.lastName;
                        user.phone = data.phone;
                        user.profilePicture = data.profilePicture;

                        await this.userRepository.save(user);

                        resolve({
                            status: true,
                            message: `User updated successfully`
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `User doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `User doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    userDetailsIfActive(userId: number): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const user = await this.userRepository.findOneBy({
                    id: userId,
                    isActive: Boolean.True
                });

                if (user) {
                    const {
                        password,
                        ...result
                    } = user;
                    resolve({
                        status: true,
                        result: result
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `User doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    allUsersList(pageNumber: number, limit: number, keyword: string, userId: number, role: string, countryId: number, data: SortDto): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let users: UserEntity[] = [];
                let arrUsers: UserEntity[] = [];
                if (role == Roles.SuperAdmin) {
                    if (keyword) {
                        if (data.role) {
                            if (data.countryId) {
                                users = await this.userRepository.find({
                                    where: [
                                        {
                                            firstName: Like(`%${keyword}%`),
                                            role: data.role,
                                            countryId: data.countryId,
                                        },
                                        {
                                            lastName: Like(`%${keyword}%`),
                                            role: data.role,
                                            countryId: data.countryId,
                                        }
                                    ],
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                            else {
                                users = await this.userRepository.find({
                                    where: [
                                        {
                                            firstName: Like(`%${keyword}%`),
                                            role: data.role,
                                        },
                                        {
                                            lastName: Like(`%${keyword}%`),
                                            role: data.role,
                                        }
                                    ],
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                        }
                        else {
                            if (data.countryId) {
                                users = await this.userRepository.find({
                                    where: [
                                        {
                                            firstName: Like(`%${keyword}%`),
                                            countryId: data.countryId,
                                            role: Not(Roles.SuperAdmin)
                                        },
                                        {
                                            lastName: Like(`%${keyword}%`),
                                            countryId: data.countryId,
                                            role: Not(Roles.SuperAdmin)
                                        }
                                    ],
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                            else {
                                users = await this.userRepository.find({
                                    where: [
                                        {
                                            firstName: Like(`%${keyword}%`),
                                            role: Not(Roles.SuperAdmin)
                                        },
                                        {
                                            lastName: Like(`%${keyword}%`),
                                            role: Not(Roles.SuperAdmin)
                                        }
                                    ],
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                        }
                    }
                    else {
                        if (data.role) {
                            if (data.countryId) {
                                users = await this.userRepository.find({
                                    where: {
                                        role: data.role,
                                        countryId: data.countryId,
                                    },
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                            else {
                                users = await this.userRepository.find({
                                    where: {
                                        role: data.role,
                                    },
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                        }
                        else {
                            if (data.countryId) {
                                users = await this.userRepository.find({
                                    where: {
                                        countryId: data.countryId,
                                        role: Not(Roles.SuperAdmin)
                                    },
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                            else {
                                users = await this.userRepository.find({
                                    where: {
                                        role: Not(Roles.SuperAdmin)
                                    },
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                        }
                    }
                }
                else {
                    if (keyword) {
                        users = await this.userRepository.find({
                            where: [
                                {
                                    firstName: Like(`%${keyword}%`),
                                    role: Roles.Customer,
                                    countryId: countryId,
                                },
                                {
                                    lastName: Like(`%${keyword}%`),
                                    role: Roles.Customer,
                                    countryId: countryId,
                                }
                            ],
                            order: {
                                createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                            },
                        });
                    }
                    else {
                        users = await this.userRepository.find({
                            where: {
                                role: Roles.Customer,
                                countryId: countryId,
                            },
                            order: {
                                createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                            }
                        });
                    }
                }

                //pagination
                const startIndex = (pageNumber - 1) * limit;
                const endIndex = pageNumber * limit;
                let finalResult = users.slice(startIndex, endIndex);

                for (const user of finalResult) {
                    delete user.password;
                    const countryDetails: any = await this.countryServiceService.countryDetails(user.countryId);
                    user.countryId = countryDetails.result;
                    arrUsers.push(user);
                }

                resolve({
                    status: true,
                    total: users.length,
                    result: arrUsers
                });
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    allUsersListForOrders(pageNumber: number, limit: number, keyword: string, userId: number, role: string, countryId: number, data: SortDto): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let users: UserEntity[] = [];
                let arrUsers: UserEntity[] = [];
                if (role == Roles.SuperAdmin) {
                    if (keyword) {
                        if (data.role) {
                            if (data.countryId) {
                                users = await this.userRepository.find({
                                    where: [
                                        {
                                            firstName: Like(`%${keyword}%`),
                                            role: Roles.Customer,
                                            countryId: data.countryId,
                                        },
                                        {
                                            lastName: Like(`%${keyword}%`),
                                            role: Roles.Customer,
                                            countryId: data.countryId,
                                        }
                                    ],
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                            else {
                                users = await this.userRepository.find({
                                    where: [
                                        {
                                            firstName: Like(`%${keyword}%`),
                                            role: Roles.Customer,
                                        },
                                        {
                                            lastName: Like(`%${keyword}%`),
                                            role: Roles.Customer,
                                        }
                                    ],
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                        }
                        else {
                            if (data.countryId) {
                                users = await this.userRepository.find({
                                    where: [
                                        {
                                            firstName: Like(`%${keyword}%`),
                                            countryId: data.countryId,
                                            role: Roles.Customer,
                                        },
                                        {
                                            lastName: Like(`%${keyword}%`),
                                            countryId: data.countryId,
                                            role: Roles.Customer,
                                        }
                                    ],
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                            else {
                                users = await this.userRepository.find({
                                    where: [
                                        {
                                            firstName: Like(`%${keyword}%`),
                                            role: Roles.Customer,
                                        },
                                        {
                                            lastName: Like(`%${keyword}%`),
                                            role: Roles.Customer,
                                        }
                                    ],
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                        }
                    }
                    else {
                        if (data.role) {
                            if (data.countryId) {
                                users = await this.userRepository.find({
                                    where: {
                                        role: Roles.Customer,
                                        countryId: data.countryId,
                                    },
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                            else {
                                users = await this.userRepository.find({
                                    where: {
                                        role: Roles.Customer,
                                    },
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                        }
                        else {
                            if (data.countryId) {
                                users = await this.userRepository.find({
                                    where: {
                                        countryId: data.countryId,
                                        role: Roles.Customer
                                    },
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                            else {
                                users = await this.userRepository.find({
                                    where: {
                                        role: Roles.Customer
                                    },
                                    order: {
                                        createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                    }
                                });
                            }
                        }
                    }
                }
                else {
                    if (keyword) {
                        users = await this.userRepository.find({
                            where: [
                                {
                                    firstName: Like(`%${keyword}%`),
                                    role: Roles.Customer,
                                    countryId: countryId,
                                },
                                {
                                    lastName: Like(`%${keyword}%`),
                                    role: Roles.Customer,
                                    countryId: countryId,
                                }
                            ],
                            order: {
                                createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                            },
                        });
                    }
                    else {
                        users = await this.userRepository.find({
                            where: {
                                role: Roles.Customer,
                                countryId: countryId,
                            },
                            order: {
                                createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                            }
                        });
                    }
                }

                //pagination
                // const startIndex = (pageNumber - 1) * limit;
                // const endIndex = pageNumber * limit;
                // let finalResult = users.slice(startIndex, endIndex);

                for (const user of users) {
                    delete user.password;
                    const countryDetails: any = await this.countryServiceService.countryDetails(user.countryId);
                    user.countryId = countryDetails.result;
                    arrUsers.push(user);
                }

                resolve({
                    status: true,
                    total: users.length,
                    result: arrUsers
                });
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    updateCustomerPassword(userId: number, data: ChangePasswordDto): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const user = await this.userRepository.findOneBy({
                    id: userId
                });

                if (user) {
                    const isOldPasswordValid: any = await this.compareHashString(data.oldPassword, user.password);
                    if (isOldPasswordValid) {
                        if (data.oldPassword == data.newPassword) {
                            resolve({
                                status: false,
                                message: `Old and new password can not be same`
                            });
                        }
                        else {
                            const newHashString: any = await this.hashString(data.newPassword);

                            user.password = newHashString.result;
                            await this.userRepository.save(user);

                            resolve({
                                status: true,
                                message: `Password updated successfully`
                            });
                        }
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Invalid old password`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `User doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    updateStaffPassword(data: ChangeStaffPasswordDto): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const user = await this.userRepository.findOneBy({
                    id: data.userId,
                    role: Not(Roles.Customer)
                });

                if (user) {
                    const newHashString: any = await this.hashString(data.newPassword);
                    user.password = newHashString.result;
                    await this.userRepository.save(user);

                    resolve({
                        status: true,
                        message: `Password updated successfully`
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `User doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    createStaffUser(data: RegisterStaffDto): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const user = await this.userRepository.findOneBy({
                    email: data.email
                });

                if (user) {
                    resolve({
                        status: false,
                        message: `User already exists with the same email`
                    });
                }
                else {
                    //generate new password
                    const hasString: any = await this.hashString(data.password);
                    if (hasString.status) {
                        let userObj = new UserEntity();
                        userObj.email = data.email;
                        userObj.password = hasString.result;
                        userObj.isVerified = Boolean.True;
                        userObj.role = data.role;
                        userObj.firstName = data.firstName;
                        userObj.lastName = data.lastName;
                        userObj.phone = data.phone;
                        userObj.countryId = data.countryId;
                        userObj.staffRights = data.staffRights ? data.staffRights : [];

                        const saveNewUser = await this.userRepository.save(userObj);

                        this.emailService.staffWelcomeEmail(saveNewUser.email, saveNewUser.firstName, data.password);

                        resolve({
                            status: true,
                            message: `User created successfully`
                        });
                    }
                    else {
                        resolve(hasString);
                    }
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    updateStaffUser(data: UpdateStaffUserDto): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const user = await this.userRepository.findOneBy({
                    id: data.id
                });

                if (user) {
                    user.firstName = data.firstName;
                    user.lastName = data.lastName;
                    user.phone = data.phone;
                    user.role = data.role;
                    await this.userRepository.save(user);

                    resolve({
                        status: true,
                        message: `User rights updated successfully`
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `User doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    updateStaffRights(data: UpdateStaffRightsDto): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const user = await this.userRepository.findOneBy({
                    id: data.id
                });

                if (user) {
                    user.staffRights = data.staffRights ? data.staffRights : [];
                    await this.userRepository.save(user);

                    resolve({
                        status: true,
                        message: `User rights updated successfully`
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `User doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    manageUser(userId: number, isActive: number): any {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (userId) {
                    const user = await this.userRepository.findOneBy({
                        id: userId
                    });

                    if (user) {
                        if (user.role == Roles.SuperAdmin) {
                            resolve({
                                status: false,
                                message: `Super admin can not get updated`
                            });
                        }
                        else {
                            user.isActive = isActive;
                            await this.userRepository.save(user);

                            resolve({
                                status: true,
                                message: `User updated successfully`
                            });
                        }
                    }
                    else {
                        resolve({
                            status: false,
                            message: `User doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `User doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }





    hashString(string: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                bCrypt.hash(string, 10, async (err, encryptedString) => {
                    if (err) {
                        console.log(err);
                        resolve({
                            status: false,
                            error: err,
                        });
                    } else {
                        resolve({
                            status: true,
                            result: encryptedString,
                        });
                    }
                });
            }
            catch (e) {
                console.log(e);
                resolve({
                    status: false,
                    error: e,
                });
            }
        });
    }

    compareHashString(string: string, hashString: string) {
        return new Promise((resolve: any, reject: any) => {
            bCrypt.compare(string, hashString, async (err, isVerified) => {
                if (err) {
                    console.log(err);
                    resolve(false);
                } else {
                    if (isVerified) {
                        resolve(isVerified);
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }

    generateOTP(length: number) {
        return randomString.generate({
            length: length,
            charset: "numeric",
        });
    }

    generatePassword(length: number) {
        return randomString.generate({
            length: length,
            charset: "alphabetic",
        });
    }
}
