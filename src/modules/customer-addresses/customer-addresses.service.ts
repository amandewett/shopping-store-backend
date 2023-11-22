import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Boolean, CustomerAddressType } from "../../enums/enum";
import { CustomerAddressEntity } from './entity/customerAddresses.entity';
import { AddCustomerAddressDto } from './dto/addCustomerAddresses.dto';
import { UpdateCustomerAddressDto } from './dto/updateCustomerAddresses.dto';
import { CountryService } from '../country/country.service';
import { StateService } from '../state/state.service';
import { InternationalShipmentService } from '../international-shipment/international-shipment.service';

@Injectable()
export class CustomerAddressesService {
    constructor(
        @InjectRepository(CustomerAddressEntity)
        private customerAddressRepository: Repository<CustomerAddressEntity>,
        private countryService: CountryService,
        private stateService: StateService,
        private internationalShipmentService: InternationalShipmentService,
    ) { }

    addNewAddress(userId: number, data: AddCustomerAddressDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let customerAddressObj = new CustomerAddressEntity();
                customerAddressObj.userId = userId;
                customerAddressObj.name = data.name;
                customerAddressObj.email = data.email;
                customerAddressObj.phoneNumber = data.phoneNumber;
                customerAddressObj.isInternational = data.isInternational;
                customerAddressObj.countryId = data.countryId;
                customerAddressObj.stateId = data.stateId;
                customerAddressObj.address = data.address;
                customerAddressObj.address2 = data.address2;
                customerAddressObj.city = data.city;
                customerAddressObj.postalCode = data.postalCode;

                await this.customerAddressRepository.save(customerAddressObj);

                resolve({
                    status: true,
                    message: `Customer address added successfully`
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

    updateAddress(userId: number, data: UpdateCustomerAddressDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const customerAddress = await this.customerAddressRepository.findOne({
                    where: {
                        userId: userId,
                        id: data.id,
                        isDeleted: Boolean.False,
                    }
                });

                if (customerAddress) {
                    customerAddress.name = data.name;
                    customerAddress.email = data.email;
                    customerAddress.phoneNumber = data.phoneNumber;
                    customerAddress.isInternational = data.isInternational;
                    customerAddress.countryId = data.countryId;
                    customerAddress.stateId = data.stateId;
                    customerAddress.address = data.address;
                    customerAddress.address2 = data.address2;
                    customerAddress.city = data.city;
                    customerAddress.postalCode = data.postalCode;

                    await this.customerAddressRepository.save(customerAddress);

                    resolve({
                        status: true,
                        message: `Customer address updated successfully`
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `Customer address doesn't exists`
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

    customerAddressList(userId: number, countryId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const customerAddresses = await this.customerAddressRepository.find({
                    where: {
                        userId: userId,
                        countryId: countryId,
                        isDeleted: Boolean.False,
                    }
                });

                /* for (const customerAddress of customerAddresses) {
                    if (customerAddress.isInternational == Boolean.True) {
                        const internationalShipmentDetails: any = await this.internationalShipmentService.detailsInternationalShipment(customerAddress.countryId);
                        customerAddress.countryId = internationalShipmentDetails.result;
                    }
                    else {
                        const countryDetails: any = await this.countryService.countryDetails(customerAddress.countryId);
                        const stateDetails: any = await this.stateService.stateDetails(customerAddress.stateId);

                        customerAddress.countryId = countryDetails.result;
                        customerAddress.stateId = stateDetails.result;
                    }
                } */

                resolve({
                    status: true,
                    result: customerAddresses,
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

    setDefaultAddress(userId: number, id: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const customerAddress = await this.customerAddressRepository.findOne({
                    where: {
                        id: id,
                        userId: userId,
                        isDeleted: Boolean.False,
                    }
                });

                if (customerAddress) {
                    const customerAddresses = await this.customerAddressRepository.find();
                    for (let address of customerAddresses) {
                        address.isDefault = Boolean.False;
                        await this.customerAddressRepository.save(address);
                    }

                    customerAddress.isDefault = Boolean.True;
                    await this.customerAddressRepository.save(customerAddress);

                    resolve({
                        status: true,
                        message: "Success",
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `Customer address doesn't exists`
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

    customerAddressDetails(userId: number, id: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const customerAddress = await this.customerAddressRepository.findOne({
                    where: {
                        id: id,
                        userId: userId,
                    }
                });

                if (customerAddress) {
                    /* const countryDetails: any = await this.countryService.countryDetails(customerAddress.countryId);
                    const stateDetails: any = await this.stateService.stateDetails(customerAddress.stateId);

                    customerAddress.countryId = countryDetails.result;
                    customerAddress.stateId = stateDetails.result; */

                    resolve({
                        status: true,
                        result: customerAddress,
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `Customer address doesn't exists`
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

    deleteCustomerDelete(userId: number, id: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const customerAddress = await this.customerAddressRepository.findOne({
                    where: {
                        id: id,
                        userId: userId,
                    }
                });

                if (customerAddress) {
                    if (customerAddress.isDefault == Boolean.True) {
                        resolve({
                            status: false,
                            message: `Default address can not be deleted`
                        });
                    }
                    else {
                        customerAddress.isDeleted = Boolean.True;
                        await this.customerAddressRepository.save(customerAddress);

                        resolve({
                            status: true,
                            result: `Customer address deleted successfully`,
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Customer address doesn't exists`
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
