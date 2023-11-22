import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from "fs";
import { Like, Repository } from 'typeorm';
import { Boolean } from "../../enums/enum";
import { CreateProductSubCategoryDto } from './dto/createProductSubCategory.dto';
import { ProductSubCategoryEntity } from './entity/productSubCategory.entity';
import { UpdateProductSubCategoryDto } from './dto/updateProductSubCategory.sto';

@Injectable()
export class ProductSubCategoryService {
    constructor(
        @InjectRepository(ProductSubCategoryEntity)
        private productSubCategoryRepository: Repository<ProductSubCategoryEntity>
    ) { }

    createProductSubCategory(userId: number, data: CreateProductSubCategoryDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const subCategory = await this.productSubCategoryRepository.findOneBy({
                    englishName: data.englishName
                });

                if (subCategory) {
                    resolve({
                        status: false,
                        message: `Product sub category already exists`
                    });
                }
                else {
                    let subcategoryObj = new ProductSubCategoryEntity();
                    subcategoryObj.englishName = data.englishName;
                    subcategoryObj.arabicName = data.arabicName;
                    subcategoryObj.englishDescription = data.englishDescription;
                    subcategoryObj.arabicDescription = data.arabicDescription;
                    subcategoryObj.addedBy = userId;

                    await this.productSubCategoryRepository.save(subcategoryObj);

                    resolve({
                        status: true,
                        message: `Product sub category created successfully`
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

    updateProductSubCategory(userId: number, data: UpdateProductSubCategoryDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (data.id) {
                    const subCategory = await this.productSubCategoryRepository.findOneBy({
                        id: data.id,
                    });

                    if (subCategory) {
                        subCategory.englishName = data.englishName;
                        subCategory.arabicName = data.arabicName;
                        subCategory.englishDescription = data.englishDescription;
                        subCategory.arabicDescription = data.arabicDescription;
                        subCategory.addedBy = userId;
                        subCategory.isActive = data.isActive;
                        await this.productSubCategoryRepository.save(subCategory);

                        resolve({
                            status: true,
                            message: `Product sub category updated successfully`
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Product sub category doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Product sub category doesn't exists`
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

    listProductSubCategory(pageNumber: number, limit: number, keyword: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let subCategories: ProductSubCategoryEntity[]

                if (keyword) {
                    subCategories = await this.productSubCategoryRepository.findBy({
                        englishName: Like(`%${keyword}%`),
                        isActive: Boolean.True
                    });
                }
                else {
                    subCategories = await this.productSubCategoryRepository.findBy({
                        isActive: Boolean.True
                    });
                }

                //pagination
                const startIndex = (pageNumber - 1) * limit;
                const endIndex = pageNumber * limit;
                let finalResult = subCategories.slice(startIndex, endIndex);

                resolve({
                    status: true,
                    total: subCategories.length,
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

    listProductSubCategoryForStaff(pageNumber: number, limit: number, keyword: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let subCategories: ProductSubCategoryEntity[]

                if (keyword) {
                    subCategories = await this.productSubCategoryRepository.findBy({
                        englishName: Like(`%${keyword}%`)
                    });
                }
                else {
                    subCategories = await this.productSubCategoryRepository.find();
                }

                //pagination
                const startIndex = (pageNumber - 1) * limit;
                const endIndex = pageNumber * limit;
                let finalResult = subCategories.slice(startIndex, endIndex);

                resolve({
                    status: true,
                    total: subCategories.length,
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

    deleteProductSubCategory(id: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                resolve(`product table required`);
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    error: 'Error, please check server logs for more information.'
                });
            }
        });
    }

    detailsProductActiveSubCategory(id: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (id) {
                    const subCategory = await this.productSubCategoryRepository.findOneBy({
                        id: id,
                        isActive: Boolean.True
                    });

                    if (subCategory) {
                        resolve({
                            status: true,
                            result: subCategory
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Sub category doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Sub category doesn't exists`
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

    detailsProductSubCategory(id: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (id) {
                    const subCategory = await this.productSubCategoryRepository.findOneBy({
                        id: id
                    });

                    if (subCategory) {
                        resolve({
                            status: true,
                            result: subCategory
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Sub category doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Sub category doesn't exists`
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
}
