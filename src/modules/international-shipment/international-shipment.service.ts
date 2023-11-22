import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Boolean } from "../../enums/enum";
import { InternationalShipmentEntity } from './entity/internationalShipment.entity';
import { AddInternationalShipmentDto } from './dto/addInternationalShipment.dto';
import { UpdateInternationalShipmentDto } from './dto/updateInternationalShipment.dto';

@Injectable()
export class InternationalShipmentService {
    constructor(
        @InjectRepository(InternationalShipmentEntity)
        private internationalShipmentRepository: Repository<InternationalShipmentEntity>,
    ) { }

    addInternationalShipment(data: AddInternationalShipmentDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const internationalShipment = await this.internationalShipmentRepository.findOne({
                    where: {
                        countryName: data.countryName,
                    }
                });

                if (internationalShipment) {
                    resolve({
                        status: false,
                        message: `Duplicate entry not allowed`
                    });
                }
                else {
                    let internationalShipmentObj = new InternationalShipmentEntity();
                    internationalShipmentObj.countryName = data.countryName;
                    internationalShipmentObj.countryCode = data.countryCode;
                    internationalShipmentObj.countryImage = data.countryImage;
                    internationalShipmentObj.priceOne = data.priceOne;
                    internationalShipmentObj.priceTwo = data.priceTwo;

                    await this.internationalShipmentRepository.save(internationalShipmentObj);

                    resolve({
                        status: true,
                        message: `Shipment price added successfully`
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

    updateInternationalShipment(data: UpdateInternationalShipmentDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const internationalShipment = await this.internationalShipmentRepository.findOne({
                    where: {
                        id: data.id
                    }
                });

                if (internationalShipment) {
                    internationalShipment.priceOne = data.priceOne;
                    internationalShipment.priceTwo = data.priceTwo;

                    await this.internationalShipmentRepository.save(internationalShipment);

                    resolve({
                        status: true,
                        message: `Shipment price updated successfully`
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `International shipment doesn't exists`
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

    listInternationalShipment() {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const listInternationalShipments = await this.internationalShipmentRepository.find();

                resolve({
                    status: true,
                    result: listInternationalShipments
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

    listInternationalShipmentForCustomers() {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const listInternationalShipments = await this.internationalShipmentRepository.find({
                    where: {
                        isActive: Boolean.True
                    }
                });

                resolve({
                    status: true,
                    result: listInternationalShipments
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

    detailsInternationalShipment(id: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (id) {
                    const internationalShipment = await this.internationalShipmentRepository.findOne({
                        where: {
                            id: id,
                            isActive: Boolean.True
                        }
                    });

                    if (internationalShipment) {
                        resolve({
                            status: true,
                            result: internationalShipment
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `International shipment doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `International shipment doesn't exists`
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

    toggleInternationalShipment(id: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (id) {
                    const internationalShipment = await this.internationalShipmentRepository.findOne({
                        where: {
                            id: id
                        }
                    });

                    if (internationalShipment.isActive == Boolean.True) {
                        internationalShipment.isActive = Boolean.False;
                        await this.internationalShipmentRepository.save(internationalShipment);

                        resolve({
                            status: true,
                            message: `International shipment update successfully`
                        });
                    }
                    else {
                        internationalShipment.isActive = Boolean.True;
                        await this.internationalShipmentRepository.save(internationalShipment);

                        resolve({
                            status: true,
                            message: `International shipment update successfully`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `International shipment doesn't exists`
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
