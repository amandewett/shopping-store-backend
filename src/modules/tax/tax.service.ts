import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { TaxEntity } from './entity/tax.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddTaxDto } from './dto/addTax.dto';
import { UpdateTaxDto } from './dto/updateTax.dto';
import { Boolean } from 'src/enums/enum';
import { CountryService } from '../country/country.service';

@Injectable()
export class TaxService {
    constructor(
        @InjectRepository(TaxEntity)
        private taxRepository: Repository<TaxEntity>,
        @Inject(forwardRef(() => CountryService)) private countryService: CountryService,
    ) { }

    addTax(data: AddTaxDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const tax = await this.taxRepository.findOne({
                    where: {
                        countryId: data.countryId,
                        isActive: Boolean.True
                    }
                });

                if (tax) {
                    resolve({
                        status: false,
                        message: `Tax already exists`
                    });
                }
                else {
                    let taxObj = new TaxEntity();
                    taxObj.taxName = data.taxName;
                    taxObj.taxDescription = data.taxDescription;
                    taxObj.taxValue = data.taxValue;
                    taxObj.countryId = data.countryId;

                    await this.taxRepository.save(taxObj);

                    resolve({
                        status: true,
                        message: `Tax added successfully`
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

    updateTax(data: UpdateTaxDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (data.id) {
                    const tax = await this.taxRepository.findOne({
                        where: {
                            id: data.id,
                            isActive: Boolean.True
                        }
                    });

                    if (tax) {
                        tax.taxName = data.taxName;
                        tax.taxDescription = data.taxDescription;
                        tax.taxValue = data.taxValue;

                        await this.taxRepository.save(tax);

                        resolve({
                            status: true,
                            message: `Tax updated successfully`
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Tax doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Tax doesn't exists`
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

    taxList() {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const taxes = await this.taxRepository.find({
                    where: {
                        isActive: Boolean.True
                    },
                    order: {
                        countryId: "ASC"
                    }
                });

                //get country details
                for (const tax of taxes) {
                    const countryDetails: any = await this.countryService.countryDetails(tax.countryId);
                    tax.countryId = countryDetails.result;
                }

                resolve({
                    status: true,
                    result: taxes
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

    taxDetails(taxId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const tax = await this.taxRepository.findOne({
                    where: {
                        isActive: Boolean.True,
                        id: taxId
                    },
                });

                if (tax) {
                    //get country details
                    const countryDetails: any = await this.countryService.countryDetails(tax.countryId);
                    tax.countryId = countryDetails.result;

                    resolve({
                        status: true,
                        result: tax
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `Tax doesn't exists`
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

    taxDetailsByCountryId(countryId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const tax = await this.taxRepository.findOne({
                    where: {
                        isActive: Boolean.True,
                        countryId: countryId
                    },
                });

                if (tax) {
                    //get country details
                    const countryDetails: any = await this.countryService.countryDetails(tax.countryId);
                    tax.countryId = countryDetails.result;

                    resolve({
                        status: true,
                        result: tax
                    });

                }
                else {
                    resolve({
                        status: false,
                        message: `Tax doesn't exists`
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

    deleteTax(taxId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const tax = await this.taxRepository.findOne({
                    where: {
                        isActive: Boolean.True,
                        id: taxId
                    },
                });

                if (tax) {
                    tax.isActive = Boolean.False;
                    await this.taxRepository.save(tax);

                    resolve({
                        status: true,
                        messages: `Tax deleted successfully`
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `Tax doesn't exists`
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
