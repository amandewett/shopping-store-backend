import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Boolean, CouponType } from "../../enums/enum";
import { CouponEntity } from './entity/coupon.entity';
import { AddCouponDto } from './dto/addCoupon.dto';
import * as randomString from "randomstring";
import { UpdateCouponDto } from './dto/updateCoupon.dto';
import { CountryService } from '../country/country.service';

@Injectable()
export class CouponService {
    constructor(
        @InjectRepository(CouponEntity)
        private couponRepository: Repository<CouponEntity>,
        private countryService: CountryService,
    ) { }

    createNewCoupon(data: AddCouponDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const couponCode = this.generateCoupon(8);
                let couponObj = new CouponEntity();
                couponObj.couponName = data.couponName;
                couponObj.couponNameInArabic = data.couponNameInArabic;
                couponObj.couponDescription = data.couponDescription;
                couponObj.couponDescriptionInArabic = data.couponDescriptionInArabic;
                couponObj.couponPercent = data.couponPercent;
                couponObj.countryId = data.countryId;
                couponObj.expiryDate = data.expiryDate;
                couponObj.couponCode = couponCode;
                couponObj.minCartValue = data.minCartValue;
                couponObj.couponType = data.couponType;

                await this.couponRepository.save(couponObj);

                resolve({
                    status: true,
                    message: `Coupon created successfully`
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

    updateCoupon(data: UpdateCouponDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let coupon = await this.couponRepository.findOne({
                    where: {
                        id: data.id
                    },
                });

                if (coupon) {
                    coupon.couponName = data.couponName;
                    coupon.couponNameInArabic = data.couponNameInArabic;
                    coupon.couponDescription = data.couponDescription;
                    coupon.couponDescriptionInArabic = data.couponDescriptionInArabic;
                    coupon.couponPercent = data.couponPercent;
                    coupon.expiryDate = data.expiryDate;
                    coupon.minCartValue = data.minCartValue;

                    await this.couponRepository.save(coupon);

                    resolve({
                        status: true,
                        message: `Coupon updated successfully`
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `Coupon doesn't exists`
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

    listCoupons(couponType?: number, countryId?: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let coupons: CouponEntity[] = [];

                if (countryId != null) {
                    if (couponType == null) {
                        coupons = await this.couponRepository.find({
                            where: {
                                isActive: Boolean.True,
                                countryId: countryId,
                            },
                            order: {
                                createdAt: "desc",
                            },
                        });
                    }
                    else {
                        coupons = await this.couponRepository.find({
                            where: {
                                isActive: Boolean.True,
                                countryId: countryId,
                                couponType: couponType,
                            },
                            order: {
                                createdAt: "desc",
                            },
                        });
                    }
                }
                else {
                    if (couponType == null) {
                        coupons = await this.couponRepository.find({
                            where: {
                                isActive: Boolean.True,
                            },
                            order: {
                                createdAt: "desc",
                            },
                        });
                    }
                    else {
                        coupons = await this.couponRepository.find({
                            where: {
                                isActive: Boolean.True,
                                couponType: couponType,
                            },
                            order: {
                                createdAt: "desc",
                            },
                        });
                    }
                }

                for (const coupon of coupons) {
                    const countryDetails: any = await this.countryService.countryDetails(coupon.countryId);
                    if (countryDetails.status) {
                        coupon.countryId = countryDetails.result;
                    }
                }

                resolve({
                    status: true,
                    result: coupons
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

    couponDetailsCouponCode(couponCode: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let coupon = await this.couponRepository.findOne({
                    where: {
                        couponCode: couponCode,
                        isActive: Boolean.True
                    },
                });

                if (coupon) {
                    const countryDetails: any = await this.countryService.countryDetails(coupon.countryId);
                    if (countryDetails.status) {
                        coupon.countryId = countryDetails.result;
                    }

                    resolve({
                        status: true,
                        result: coupon
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `Coupon doesn't exists`
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

    couponDetails(couponId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {

                if (couponId) {
                    let coupon = await this.couponRepository.findOne({
                        where: {
                            id: couponId,
                            isActive: Boolean.True
                        },
                    });

                    if (coupon) {
                        const countryDetails: any = await this.countryService.countryDetails(coupon.countryId);
                        if (countryDetails.status) {
                            coupon.countryId = countryDetails.result;
                        }

                        resolve({
                            status: true,
                            result: coupon
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Coupon doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Coupon doesn't exists`
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

    deleteCoupon(couponId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (couponId) {
                    let coupon = await this.couponRepository.findOne({
                        where: {
                            id: couponId,
                            isActive: Boolean.True
                        },
                    });

                    if (coupon) {
                        coupon.isActive = Boolean.False;
                        await this.couponRepository.save(coupon);

                        resolve({
                            status: true,
                            message: `Coupon deleted successfully`
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Coupon doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Coupon doesn't exists`
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

    generateCoupon(length: number) {
        return randomString.generate({
            length: length,
            charset: "alphabetic",
        });
    }
}
