import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from "fs";
import { Like, Not, Repository } from 'typeorm';
import { Boolean, Roles } from "../../enums/enum";
import { CartEntity } from './entity/cart.entity';
import { AddToCartDto } from './dto/addToCart.dto';
import { DeleteFromCartDto } from './dto/deleteFromCart.dto';
import { ProductService } from '../product/product.service';
import { CountryService } from '../country/country.service';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartEntity)
        private cartRepository: Repository<CartEntity>,
        @Inject(forwardRef(() => ProductService)) private productService: ProductService,
        @Inject(forwardRef(() => CountryService)) private countryService: CountryService,
    ) { }

    addToCart(userId: number, data: AddToCartDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                //check if cart have items from other country
                const oldCartItems = await this.cartRepository.findBy({
                    userId: userId,
                    countryId: Not(data.countryId),
                });

                if (oldCartItems.length != 0) {
                    resolve({
                        status: false,
                        message: `Please remove items of other countries from your cart first.`
                    });
                }
                else {
                    //check if the same item is already in cart
                    const isItemExists = await this.cartRepository.findOneBy({
                        userId: userId,
                        productId: data.productId,
                        countryId: data.countryId,
                    });

                    if (isItemExists) {
                        isItemExists.itemCount = isItemExists.itemCount + 1;
                        await this.cartRepository.save(isItemExists);

                        resolve({
                            status: true,
                            message: `Product added to cart`
                        });
                    }
                    else {
                        let cartObj = new CartEntity();

                        cartObj.userId = userId;
                        cartObj.productId = data.productId;
                        cartObj.countryId = data.countryId;
                        cartObj.itemCount = 1;

                        await this.cartRepository.save(cartObj);

                        resolve({
                            status: true,
                            message: `Product added to cart`
                        });
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

    clearCart(userId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const cartItems = await this.cartRepository.find({
                    where: {
                        userId: userId
                    }
                });

                if (cartItems.length == 0) {
                    resolve({
                        status: true,
                        message: `Cart doesn't have items`
                    });
                }
                else {
                    for (const cartItem of cartItems) {
                        await this.cartRepository.delete({
                            id: cartItem.id
                        });
                    }

                    resolve({
                        status: true,
                        message: `Cart cleared successfully`
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

    deleteFromCart(userId: number, data: DeleteFromCartDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const cartItem = await this.cartRepository.findOne({
                    where: {
                        userId: userId,
                        productId: data.productId,
                        countryId: data.countryId,
                    }
                });
                if (cartItem) {
                    if (cartItem.itemCount == 1) {
                        await this.cartRepository.delete({
                            id: cartItem.id,
                        });

                        resolve({
                            status: true,
                            message: `Cart item removed successfully`
                        });
                    }
                    else {
                        cartItem.itemCount = cartItem.itemCount - 1;
                        await this.cartRepository.save(cartItem);

                        resolve({
                            status: true,
                            message: `Cart item removed successfully`
                        });
                    }
                }
                else {
                    resolve({
                        status: true,
                        message: `Cart item doesn't exists`
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

    listCartItems(userId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const cartItems = await this.cartRepository.find({
                    where: {
                        userId: userId
                    },
                    order: {
                        createdAt: "DESC"
                    }

                });

                for (const cartItem of cartItems) {
                    const productDetails: any = await this.productService.productDetails(cartItem.productId);
                    cartItem.productId = productDetails.result;
                }

                resolve({
                    status: true,
                    result: cartItems
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
}
