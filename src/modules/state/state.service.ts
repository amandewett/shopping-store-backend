import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boolean } from "../../enums/enum";
import { StateEntity } from './entity/state.entity';
import { AddStateDto } from './dto/addState.dto';
import { UpdateStateDto } from './dto/updateState.dto';

@Injectable()
export class StateService {
    constructor(
        @InjectRepository(StateEntity)
        private stateRepository: Repository<StateEntity>
    ) { }

    addNewState(userId: number, data: AddStateDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const state = await this.stateRepository.findOneBy({
                    stateName: data.stateName
                });

                if (state) {
                    resolve({
                        status: false,
                        message: `State already exists`
                    });
                }
                else {
                    let stateObj = new StateEntity();
                    stateObj.countryId = data.countryId;
                    stateObj.stateName = data.stateName;
                    stateObj.shipmentPrice = data.shipmentPrice;
                    stateObj.addedBy = userId;

                    await this.stateRepository.save(stateObj);
                    resolve({
                        status: true,
                        message: `State added successfully`
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

    updateState(userId: number, data: UpdateStateDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const state = await this.stateRepository.findOneBy({
                    id: data.id
                });

                if (state) {
                    state.countryId = data.countryId;
                    state.stateName = data.stateName;
                    state.shipmentPrice = data.shipmentPrice;
                    state.addedBy = userId;

                    await this.stateRepository.save(state);
                    resolve({
                        status: true,
                        message: `State updated successfully`
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `State doesn't exists`
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

    staffStateList(countryId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const states = await this.stateRepository.findBy({
                    countryId: countryId
                });

                resolve({
                    status: true,
                    result: states
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

    stateList(countryId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const states = await this.stateRepository.findBy({
                    countryId: countryId,
                    isActive: Boolean.True
                });

                resolve({
                    status: true,
                    result: states
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

    stateDetails(stateId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (stateId) {
                    const state = await this.stateRepository.findOneBy({
                        id: stateId
                    });

                    if (state) {
                        resolve({
                            status: true,
                            result: state
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `State doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `State doesn't exists`
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

    manageState(stateId: number, isActive: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (stateId) {
                    const state = await this.stateRepository.findOneBy({
                        id: stateId
                    });

                    if (state) {
                        state.isActive = isActive;
                        await this.stateRepository.save(state);

                        resolve({
                            status: true,
                            result: `State updated successfully`
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `State doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `State doesn't exists`
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

    deleteState(stateId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (stateId) {
                    const state = await this.stateRepository.findOneBy({
                        id: stateId
                    });

                    if (state) {
                        await this.stateRepository.delete({
                            id: stateId
                        });

                        resolve({
                            status: true,
                            result: `State deleted successfully`
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `State doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `State doesn't exists`
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
