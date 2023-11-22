import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from "fs";
import * as path from "path";
import { Like, Not, Repository } from 'typeorm';
import { Boolean, Roles } from "../../enums/enum";
import { ProductEntity } from './entity/product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductSubCategoryService } from '../product-sub-category/product-sub-category.service';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSubCategoryEntity } from '../product-sub-category/entity/productSubCategory.entity';
import { SortDto } from '../shared/dto/sort.dto';
import { CountryService } from '../country/country.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>,
        @Inject(forwardRef(() => ProductSubCategoryService)) private productSubCategoryService: ProductSubCategoryService,
        @Inject(forwardRef(() => ProductCategoryService)) private productCategoryService: ProductCategoryService,
        @Inject(forwardRef(() => CountryService)) private countryService: CountryService,
    ) { }

    createProduct(userId: number, role: string, countryId: number, data: CreateProductDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let productObj = new ProductEntity();

                const videoCount: any = await this.analyzeProductMedia(data.arrMedia);
                if (videoCount.status && videoCount.result > 1) {
                    resolve({
                        status: false,
                        message: `Can not upload more than one video`
                    });
                }
                else {
                    productObj.englishName = data.englishName;
                    productObj.englishDescription = data.englishDescription;
                    productObj.arabicName = data.arabicName;
                    productObj.arabicDescription = data.arabicDescription;
                    productObj.countryId = role === Roles.Admin ? countryId : data.countryId ? data.countryId : countryId;
                    productObj.categoryId = data.categoryId;
                    productObj.subCategoryId = data.subCategoryId;
                    productObj.price = data.price;
                    productObj.arrMedia = data.arrMedia;
                    productObj.isFeatured = data.isFeatured;
                    productObj.isNewArrival = data.isNewArrival;
                    productObj.isPackage = data.isPackage;
                    productObj.addedBy = userId;
                    productObj.weight = data.weight;

                    await this.productRepository.save(productObj);

                    resolve({
                        status: true,
                        message: `Product created successfully`
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

    analyzeProductMedia(arrMedia: string[]) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let videoCount = 0;
                for (const url of arrMedia) {
                    const listVideoExt: string[] = ['.mp4', '.mov', '.avi', '.mkv'];
                    const ext = path.extname(url);
                    if (listVideoExt.indexOf(ext) != -1) {
                        videoCount++;
                    }
                }
                resolve({
                    status: true,
                    result: videoCount
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

    updateProduct(userId: number, data: UpdateProductDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (data.id) {
                    const product = await this.productRepository.findOne({
                        where: {
                            id: data.id
                        }
                    });

                    if (product) {

                        const videoCount: any = await this.analyzeProductMedia(data.arrMedia);
                        if (videoCount.status && videoCount.result > 1) {
                            resolve({
                                status: false,
                                message: `Can not upload more than one video`
                            });
                        }
                        else {
                            product.englishName = data.englishName;
                            product.englishDescription = data.englishDescription;
                            product.arabicName = data.arabicName;
                            product.arabicDescription = data.arabicDescription;
                            product.categoryId = data.categoryId;
                            product.subCategoryId = data.subCategoryId;
                            product.price = data.price;
                            product.arrMedia = data.arrMedia;
                            product.isFeatured = data.isFeatured;
                            product.isNewArrival = data.isNewArrival;
                            product.isPackage = data.isPackage;
                            product.addedBy = userId;
                            product.weight = data.weight;

                            await this.productRepository.save(product);

                            resolve({
                                status: true,
                                message: `Product updated successfully`
                            });
                        }
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Product doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Product doesn't exists`
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

    productStaffList(pageNumber: number, limit: number, keyword: string, role: string, countryId: number, data: SortDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let products: ProductEntity[];
                if (role == Roles.SuperAdmin) {
                    if (keyword) {
                        if (data.countryId) {
                            products = await this.productRepository.find({
                                where: [
                                    {
                                        englishName: Like(`%${keyword}%`),
                                        countryId: data.countryId,
                                    },
                                    {
                                        arabicName: Like(`%${keyword}%`),
                                        countryId: data.countryId,
                                    },
                                ],
                                order: {
                                    createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                }
                            });
                        }
                        else {
                            products = await this.productRepository.find({
                                where: [
                                    {
                                        englishName: Like(`%${keyword}%`),
                                    },
                                    {
                                        arabicName: Like(`%${keyword}%`),
                                    },
                                ],
                                order: {
                                    createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                }
                            });
                        }
                    }
                    else {
                        if (data.countryId) {
                            products = await this.productRepository.find({
                                where: {
                                    countryId: data.countryId,
                                },
                                order: {
                                    createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                }
                            });
                        }
                        else {
                            products = await this.productRepository.find({
                                order: {
                                    createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",
                                }
                            });
                        }
                    }
                }
                else {
                    if (keyword) {
                        products = await this.productRepository.find({
                            where: [
                                {
                                    englishName: Like(`%${keyword}%`),
                                    countryId: countryId,
                                    isActive: Boolean.True,
                                },
                                {
                                    arabicName: Like(`%${keyword}%`),
                                    countryId: countryId,
                                    isActive: Boolean.True,
                                },
                            ],
                            order: {
                                createdAt: data.orderBy == "ASC" ? "ASC" : "DESC",

                            }
                        });
                    }
                    else {
                        products = await this.productRepository.find({
                            where: {
                                countryId: countryId,
                                isActive: Boolean.True,
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
                let finalResult: ProductEntity[] = products.slice(startIndex, endIndex);

                //get category and sub category
                for (const product of finalResult) {
                    const productSubCategoryDetails: any = await this.productSubCategoryService.detailsProductSubCategory(product.subCategoryId);
                    const productCategoryDetails: any = await this.productCategoryService.detailsProductCategory(product.categoryId);
                    const countryDetails: any = await this.countryService.countryDetails(product.countryId);
                    product.countryId = countryDetails.result;
                    product.subCategoryId = productSubCategoryDetails.result;
                    product.categoryId = productCategoryDetails.result;
                }

                resolve({
                    status: true,
                    total: products.length,
                    result: finalResult
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

    productList(pageNumber: number, limit: number, keyword: string, countryId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let products: ProductEntity[];

                if (keyword) {
                    products = await this.productRepository.find({
                        where: [
                            {
                                englishName: Like(`%${keyword}%`),
                                isActive: Boolean.True,
                                countryId: countryId,
                            },
                            {
                                arabicName: Like(`%${keyword}%`),
                                isActive: Boolean.True,
                                countryId: countryId,
                            },
                        ],
                        order: {
                            createdAt: "desc"
                        }
                    });
                }
                else {
                    products = await this.productRepository.find({
                        where: {
                            isActive: Boolean.True,
                            countryId: countryId
                        },
                        order: {
                            createdAt: "desc"
                        }

                    });
                }

                //pagination
                const startIndex = (pageNumber - 1) * limit;
                const endIndex = pageNumber * limit;
                let finalResult: ProductEntity[] = products.slice(startIndex, endIndex);

                //get category and sub category
                for (const product of finalResult) {
                    const productSubCategoryDetails: any = await this.productSubCategoryService.detailsProductSubCategory(product.subCategoryId);
                    const productCategoryDetails: any = await this.productCategoryService.detailsProductCategory(product.categoryId);
                    product.subCategoryId = productSubCategoryDetails.result;
                    product.categoryId = productCategoryDetails.result;
                }

                resolve({
                    status: true,
                    total: products.length,
                    result: finalResult
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

    featuredProductList(countryId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const products = await this.productRepository.find({
                    where: {
                        isActive: Boolean.True,
                        isFeatured: Boolean.True,
                        countryId: countryId
                    },
                    order: {
                        createdAt: "DESC"
                    },
                });

                //get category and sub category
                for (const product of products) {
                    const productSubCategoryDetails: any = await this.productSubCategoryService.detailsProductSubCategory(product.subCategoryId);
                    const productCategoryDetails: any = await this.productCategoryService.detailsProductCategory(product.categoryId);
                    product.subCategoryId = productSubCategoryDetails.result;
                    product.categoryId = productCategoryDetails.result;
                }

                resolve({
                    status: true,
                    result: products
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

    newArrivalProductList(countryId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const products = await this.productRepository.find({
                    where: {
                        isActive: Boolean.True,
                        isNewArrival: Boolean.True,
                        countryId: countryId
                    },
                    order: {
                        createdAt: "DESC"
                    },
                });

                //get category and sub category
                for (const product of products) {
                    const productSubCategoryDetails: any = await this.productSubCategoryService.detailsProductSubCategory(product.subCategoryId);
                    const productCategoryDetails: any = await this.productCategoryService.detailsProductCategory(product.categoryId);
                    product.subCategoryId = productSubCategoryDetails.result;
                    product.categoryId = productCategoryDetails.result;
                }

                resolve({
                    status: true,
                    result: products
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

    packageProductList(countryId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const products = await this.productRepository.find({
                    where: {
                        isActive: Boolean.True,
                        isPackage: Boolean.True,
                        countryId: countryId
                    },
                    order: {
                        createdAt: "DESC"
                    },
                });

                //get category and sub category
                for (const product of products) {
                    const productSubCategoryDetails: any = await this.productSubCategoryService.detailsProductSubCategory(product.subCategoryId);
                    const productCategoryDetails: any = await this.productCategoryService.detailsProductCategory(product.categoryId);
                    product.subCategoryId = productSubCategoryDetails.result;
                    product.categoryId = productCategoryDetails.result;
                }

                resolve({
                    status: true,
                    result: products
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

    productListByCategory(pageNumber: number, limit: number, countryId: number, categoryId: number, keyword: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let products = [];

                if (keyword) {
                    products = await this.productRepository.find({
                        where: [
                            {
                                englishName: Like(`%${keyword}%`),
                                isActive: Boolean.True,
                                countryId: countryId,
                                categoryId: categoryId,
                            },
                            {
                                arabicName: Like(`%${keyword}%`),
                                isActive: Boolean.True,
                                countryId: countryId,
                                categoryId: categoryId,
                            },
                        ],
                        order: {
                            createdAt: "desc"
                        }
                    });
                }
                else {
                    products = await this.productRepository.find({
                        where: {
                            isActive: Boolean.True,
                            categoryId: categoryId,
                            countryId: countryId,
                        },
                        order: {
                            createdAt: "desc"
                        }

                    });
                }

                //pagination
                const startIndex = (pageNumber - 1) * limit;
                const endIndex = pageNumber * limit;
                let finalResult: ProductEntity[] = products.slice(startIndex, endIndex);

                //get category and sub category
                for (const product of finalResult) {
                    const productSubCategoryDetails: any = await this.productSubCategoryService.detailsProductSubCategory(product.subCategoryId);
                    const productCategoryDetails: any = await this.productCategoryService.detailsProductCategory(product.categoryId);
                    product.subCategoryId = productSubCategoryDetails.result;
                    product.categoryId = productCategoryDetails.result;
                }

                resolve({
                    status: true,
                    total: products.length,
                    result: finalResult
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


    shopProductList(pageNumber: number, limit: number, countryId: number, keyword: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let products = [];

                const packageCategory: any = await this.productCategoryService.getPackageCategoryId();
                if (packageCategory.status) {
                    if (keyword) {
                        products = await this.productRepository.find({
                            where: [
                                {
                                    englishName: Like(`%${keyword}%`),
                                    isActive: Boolean.True,
                                    countryId: countryId,
                                    categoryId: Not(packageCategory.result.id),
                                },
                                {
                                    arabicName: Like(`%${keyword}%`),
                                    isActive: Boolean.True,
                                    countryId: countryId,
                                    categoryId: Not(packageCategory.result.id),
                                },
                            ],
                            order: {
                                createdAt: "desc"
                            }
                        });
                    }
                    else {
                        products = await this.productRepository.find({
                            where: {
                                isActive: Boolean.True,
                                countryId: countryId,
                                categoryId: Not(packageCategory.result.id),
                            },
                            order: {
                                createdAt: "DESC"
                            }

                        });
                    }

                    //pagination
                    const startIndex = (pageNumber - 1) * limit;
                    const endIndex = pageNumber * limit;
                    let finalResult: ProductEntity[] = products.slice(startIndex, endIndex);

                    //get category and sub category
                    for (const product of finalResult) {
                        const productSubCategoryDetails: any = await this.productSubCategoryService.detailsProductSubCategory(product.subCategoryId);
                        const productCategoryDetails: any = await this.productCategoryService.detailsProductCategory(product.categoryId);
                        product.subCategoryId = productSubCategoryDetails.result;
                        product.categoryId = productCategoryDetails.result;
                    }

                    resolve({
                        status: true,
                        total: products.length,
                        result: finalResult
                    });

                }
                else {
                    if (keyword) {
                        products = await this.productRepository.find({
                            where: [
                                {
                                    englishName: Like(`%${keyword}%`),
                                    isActive: Boolean.True,
                                    countryId: countryId,
                                },
                                {
                                    arabicName: Like(`%${keyword}%`),
                                    isActive: Boolean.True,
                                    countryId: countryId,
                                },
                            ],
                            order: {
                                createdAt: "desc"
                            }
                        });
                    }
                    else {
                        products = await this.productRepository.find({
                            where: {
                                isActive: Boolean.True,
                                countryId: countryId,
                            },
                            order: {
                                createdAt: "DESC"
                            }

                        });
                    }

                    //pagination
                    const startIndex = (pageNumber - 1) * limit;
                    const endIndex = pageNumber * limit;
                    let finalResult: ProductEntity[] = products.slice(startIndex, endIndex);

                    //get category and sub category
                    for (const product of finalResult) {
                        const productSubCategoryDetails: any = await this.productSubCategoryService.detailsProductSubCategory(product.subCategoryId);
                        const productCategoryDetails: any = await this.productCategoryService.detailsProductCategory(product.categoryId);
                        product.subCategoryId = productSubCategoryDetails.result;
                        product.categoryId = productCategoryDetails.result;
                    }

                    resolve({
                        status: true,
                        total: products.length,
                        result: finalResult
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

    productDetails(id: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (id) {
                    const product = await this.productRepository.findOneBy({
                        id: id
                    });

                    if (product) {
                        const productSubCategoryDetails: any = await this.productSubCategoryService.detailsProductSubCategory(product.subCategoryId);
                        const productCategoryDetails: any = await this.productCategoryService.detailsProductCategory(product.categoryId);
                        product.subCategoryId = productSubCategoryDetails.result;
                        product.categoryId = productCategoryDetails.result;

                        resolve({
                            status: true,
                            result: product
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Product doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Product doesn't exists`
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

    manageProductActiveStatus(userId: number, id: number, isActive: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (id) {
                    const product = await this.productRepository.findOne({
                        where: {
                            id: id
                        }
                    });

                    if (product) {
                        product.isActive = isActive;
                        product.addedBy = userId;

                        await this.productRepository.save(product);

                        resolve({
                            status: true,
                            message: `Product updated successfully`
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Product doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Product doesn't exists`
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



    isCategoryInUse(categoryId: number): Promise<Boolean> {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const products = await this.productRepository.findBy({
                    categoryId: categoryId
                });

                if (products.length == 0) {
                    resolve(false);
                }
                else {
                    resolve(true);
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
}
