import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from "@nestjs/core";
import { UserService } from "../modules/user/user.service";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Roles } from "src/enums/enum";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
        private reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
        const request: Request = context.switchToHttp().getRequest();
        const arrRestrictedEndPoints = ["/api/productSubCategory/create", "/api/productSubCategory/update", "/api/productCategory/create", "/api/productCategory/update", "/api/product/create", "/api/product/update"];

        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: process.env.JWT_SECRET
                }
            );
            if (roles) {
                if (this.validateRoles(roles, payload.role)) {
                    const userDetails = await this.userService.userDetailsIfActive(payload.id);
                    if (userDetails.status) {
                        const userData: UserEntity = userDetails.result;
                        if (userData.role == Roles.Admin) {
                            const adminRights: string[] = userData.staffRights;
                            const currentRequestUrl = request.originalUrl;
                            if (arrRestrictedEndPoints.includes(currentRequestUrl)) {
                                // admin is trying to access a restricted endpoint, check if he has the rights
                                if (adminRights.includes(currentRequestUrl)) {
                                    request['user'] = userDetails.result;
                                    return true;
                                }
                                else {
                                    throw new UnauthorizedException();
                                }
                            }
                            else {
                                request['user'] = userDetails.result;
                                return true;
                            }
                        }
                        else {
                            request['user'] = userDetails.result;
                            return true;
                        }
                    }
                    else {
                        throw new UnauthorizedException();
                    }
                }
                else {
                    throw new UnauthorizedException();
                }
            }
            else {
                const userDetails = await this.userService.userDetailsIfActive(payload.id);
                if (userDetails.status) {
                    request['user'] = userDetails.result;
                    return true;
                }
                else {
                    throw new UnauthorizedException();
                }
            }
        }
        catch {
            throw new UnauthorizedException();
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private validateRoles(roles: string[], userRoles: string[]) {
        return roles.some(role => userRoles.includes(role));
    }
}