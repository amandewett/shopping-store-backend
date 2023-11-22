import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from "fs";
import { Like, Repository } from 'typeorm';
import { Boolean } from "../../enums/enum";
import { CreateProductCategoryDto } from './dto/createProductCategory.dto';
import { ProductCategoryEntity } from './entity/productCategory.entity';
import { UpdateProductCategoryDto } from './dto/updateProductCategory.dto';
import { ProductSubCategoryService } from "../product-sub-category/product-sub-category.service";
import { ProductService } from '../product/product.service';
import { ProductEntity } from '../product/entity/product.entity';
import { CountryService } from '../country/country.service';

@Injectable()
export class ProductCategoryService {
    constructor(
        @InjectRepository(ProductCategoryEntity)
        private productCategoryRepository: Repository<ProductCategoryEntity>,
        @Inject(forwardRef(() => ProductService)) private productService: ProductService,
        @Inject(forwardRef(() => ProductSubCategoryService)) private productSubCategoryService: ProductSubCategoryService,
    ) { }

    createProductCategory(userId: number, data: CreateProductCategoryDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const category = await this.productCategoryRepository.findOneBy({
                    englishName: data.englishName
                });

                if (category) {
                    resolve({
                        status: false,
                        message: `Product category already exists`
                    });
                }
                else {
                    let categoryObj = new ProductCategoryEntity();
                    categoryObj.englishName = data.englishName;
                    categoryObj.arabicName = data.arabicName;
                    categoryObj.englishDescription = data.englishDescription;
                    categoryObj.arabicDescription = data.arabicDescription;
                    categoryObj.isFeatured = data.isFeatured;
                    categoryObj.addedBy = userId;
                    categoryObj.arrSubCategories = data.arrSubCategories ? data.arrSubCategories : [];
                    await this.productCategoryRepository.save(categoryObj);

                    resolve({
                        status: true,
                        message: `Product category created successfully`
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

    updateProductCategory(userId: number, data: UpdateProductCategoryDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const category = await this.productCategoryRepository.findOneBy({
                    id: data.id
                });

                if (category) {
                    category.englishName = data.englishName;
                    category.arabicName = data.arabicName;
                    category.englishDescription = data.englishDescription;
                    category.arabicDescription = data.arabicDescription;
                    category.isFeatured = data.isFeatured;
                    category.addedBy = userId;
                    category.isActive = data.isActive;
                    category.arrSubCategories = data.arrSubCategories;

                    await this.productCategoryRepository.save(category);

                    resolve({
                        status: true,
                        message: `Product category updated successfully`
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `Product category doesn't exists`
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

    listProductCategory(pageNumber: number, limit: number, keyword: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let categories: ProductCategoryEntity[];

                if (keyword) {
                    categories = await this.productCategoryRepository.findBy({
                        englishName: Like(`%${keyword}%`),
                        isActive: Boolean.True
                    });
                }
                else {
                    categories = await this.productCategoryRepository.findBy({
                        isActive: Boolean.True
                    });
                }

                //pagination
                const startIndex = (pageNumber - 1) * limit;
                const endIndex = pageNumber * limit;
                let finalResult = categories.slice(startIndex, endIndex);

                //get sub categories                
                for (const category of finalResult) {
                    let arrSubCategoriesDetails = [];
                    if (category.arrSubCategories.length != 0) {
                        for (const subCategoryId of category.arrSubCategories) {
                            const subcategory: any = await this.productSubCategoryService.detailsProductActiveSubCategory(+subCategoryId);
                            if (subcategory.status) {
                                arrSubCategoriesDetails.push(subcategory.result);
                            }
                        }
                        delete category.arrSubCategories;
                        category['arrSubCategories'] = arrSubCategoriesDetails;
                    }
                }

                resolve({
                    status: true,
                    total: categories.length,
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

    listProductCategoryForStaff(pageNumber: number, limit: number, keyword: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let categories: ProductCategoryEntity[];

                if (keyword) {
                    categories = await this.productCategoryRepository.findBy({
                        englishName: Like(`%${keyword}%`)
                    });
                }
                else {
                    categories = await this.productCategoryRepository.find();
                }

                //pagination
                const startIndex = (pageNumber - 1) * limit;
                const endIndex = pageNumber * limit;
                let finalResult = categories.slice(startIndex, endIndex);

                //get sub categories                
                for (const category of finalResult) {
                    let arrSubCategoriesDetails = [];
                    if (category.arrSubCategories.length != 0) {
                        for (const subCategoryId of category.arrSubCategories) {
                            const subcategory: any = await this.productSubCategoryService.detailsProductSubCategory(+subCategoryId);
                            if (subcategory.status) {
                                arrSubCategoriesDetails.push(subcategory.result);
                            }
                        }
                        delete category.arrSubCategories;
                        category['arrSubCategories'] = arrSubCategoriesDetails;
                    }
                }

                resolve({
                    status: true,
                    total: categories.length,
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

    listFeaturedProductCategory() {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let categories: ProductCategoryEntity[] = await this.productCategoryRepository.findBy({
                    isFeatured: Boolean.True,
                    isActive: Boolean.True
                });

                //get sub categories
                let arrSubCategoriesDetails = [];
                for (const category of categories) {
                    if (category.arrSubCategories.length != 0) {
                        for (const subCategoryId of category.arrSubCategories) {
                            const subcategory: any = await this.productSubCategoryService.detailsProductActiveSubCategory(+subCategoryId);
                            if (subcategory.status) {
                                arrSubCategoriesDetails.push(subcategory.result);
                            }
                        }
                        delete category.arrSubCategories;
                        category['arrSubCategories'] = arrSubCategoriesDetails;
                    }
                }

                resolve({
                    status: true,
                    total: categories.length,
                    result: categories
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

    deleteProductCategory(id: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (id) {
                    const isCategoryInUse: Boolean = await this.productService.isCategoryInUse(id);
                    if (isCategoryInUse) {
                        resolve({
                            status: false,
                            message: `Some products are using this category, thus can not be deleted.`
                        });
                    }
                    else {
                        await this.productCategoryRepository.delete({
                            id: id
                        });

                        resolve({
                            status: true,
                            message: `Product deleted successfully`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Product category doesn't exists`
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

    detailsProductCategory(id: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (id) {
                    const category = await this.productCategoryRepository.findOneBy({
                        id: id
                    });

                    if (category) {
                        //get sub categories
                        let arrSubCategoriesDetails = [];
                        if (category.arrSubCategories.length != 0) {
                            for (const subCategoryId of category.arrSubCategories) {
                                const subcategory: any = await this.productSubCategoryService.detailsProductSubCategory(+subCategoryId);
                                if (subcategory.status) {
                                    arrSubCategoriesDetails.push(subcategory.result);
                                }
                            }
                            delete category.arrSubCategories;
                            category['arrSubCategories'] = arrSubCategoriesDetails;
                        }

                        resolve({
                            status: true,
                            result: category
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Product category doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Product category doesn't exists`
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

    getPackageCategoryId() {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const category = await this.productCategoryRepository.findOneBy({
                    englishName: Like(`%package%`)
                });

                if (category) {
                    //get sub categories
                    let arrSubCategoriesDetails = [];
                    if (category.arrSubCategories.length != 0) {
                        for (const subCategoryId of category.arrSubCategories) {
                            const subcategory: any = await this.productSubCategoryService.detailsProductSubCategory(+subCategoryId);
                            if (subcategory.status) {
                                arrSubCategoriesDetails.push(subcategory.result);
                            }
                        }
                        delete category.arrSubCategories;
                        category['arrSubCategories'] = arrSubCategoriesDetails;
                    }

                    resolve({
                        status: true,
                        result: category
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `Product category doesn't exists`
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
