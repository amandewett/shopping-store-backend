import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from "fs";
import * as path from "path";
import { AddCountryDto } from './dto/addCountry.dto';
import { CountryEntity } from "./entity/country.entity";
import { Not, Repository } from 'typeorm';
import { UpdateCountryDto } from './dto/updateCountry.dto';
import { Boolean, Languages } from "../../enums/enum";

@Injectable()
export class CountryService {
    constructor(
        @InjectRepository(CountryEntity)
        private countryRepository: Repository<CountryEntity>
    ) { }

    getAllCountries(keyword: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const countriesDataFilePath = `./src/config/countries-data.json`;

                if (fs.existsSync(countriesDataFilePath)) {
                    fs.readFile(countriesDataFilePath, "utf-8", (err, data) => {
                        if (err) {
                            console.log(err);
                            resolve({
                                status: false,
                                error: err
                            });
                        }
                        else {
                            let result;

                            if (keyword) {
                                result = JSON.parse(data).filter((obj: any) => Object.values(obj).some((val: any) => val.toLowerCase().includes(keyword.toLowerCase())));
                            }
                            else {
                                result = JSON.parse(data);
                            }

                            resolve({
                                status: true,
                                total: result.length,
                                result: result
                            });
                        }
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `Countries data doesn't exists`
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

    addInternationalCountry() {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const country = await this.countryRepository.findOneBy({
                    countryName: "International"
                });

                if (country) {
                    resolve(false);
                }
                else {
                    let countryObj = new CountryEntity();
                    countryObj.countryName = "International";
                    countryObj.countryCode = "International";
                    countryObj.currencyName = "Dollar";
                    countryObj.currencyCode = "$";
                    countryObj.currencyCodeInArabic = "";
                    countryObj.defaultLanguage = Languages.english;

                    const saveCountry = await this.countryRepository.save(countryObj);
                    resolve({
                        status: true,
                        result: saveCountry
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

    addNewCountry(data: AddCountryDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const country = await this.countryRepository.findOneBy({
                    countryName: data.countryName,
                    isDeleted: Boolean.False
                });

                if (country) {
                    resolve({
                        status: false,
                        message: `Country already exists`
                    });
                }
                else {
                    if (data.image) {
                        const ext = path.extname(data.image);
                        if (ext == ".svg") {
                            let countryObj = new CountryEntity();
                            countryObj.countryName = data.countryName;
                            countryObj.countryCode = data.countryCode;
                            countryObj.currencyName = data.currencyName;
                            countryObj.currencyCode = data.currencyCode;
                            countryObj.currencyCodeInArabic = data.currencyCodeInArabic;
                            countryObj.defaultLanguage = data.defaultLanguage;
                            countryObj.image = data.image;
                            countryObj.phoneNumber = data.phoneNumber;
                            countryObj.email = data.email;
                            countryObj.address = data.address;
                            countryObj.latitude = data.latitude;
                            countryObj.longitude = data.longitude;

                            const saveCountry = await this.countryRepository.save(countryObj);
                            resolve({
                                status: true,
                                result: saveCountry
                            });
                        }
                        else {
                            resolve({
                                status: false,
                                message: `Please upload a SVG formatted image`
                            });
                        }
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Image required`
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

    updateCountry(data: UpdateCountryDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const country = await this.countryRepository.findOneBy({
                    id: data.id,
                    isDeleted: Boolean.False
                });

                if (country) {
                    country.countryName = data.countryName;
                    country.countryCode = data.countryCode;
                    country.currencyName = data.currencyName;
                    country.currencyCode = data.currencyCode;
                    country.currencyCodeInArabic = data.currencyCodeInArabic;
                    country.defaultLanguage = data.defaultLanguage;
                    country.image = data.image;
                    country.phoneNumber = data.phoneNumber;
                    country.email = data.email;
                    country.address = data.address;
                    country.latitude = data.latitude;
                    country.longitude = data.longitude;

                    await this.countryRepository.save(country);

                    resolve({
                        status: true,
                        message: `Country updated successfully`
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `Country doesn't exists`
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

    listActiveCountries() {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const countries = await this.countryRepository.findBy({
                    countryName: Not(`International`)
                });
                resolve({
                    status: true,
                    result: countries
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

    listActiveCountriesForMobileApp() {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const countries = await this.countryRepository.findBy({
                    isDeleted: Boolean.False,
                });
                resolve({
                    status: true,
                    result: countries
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

    activeCountryDetails(countryId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (countryId) {
                    const country = await this.countryRepository.findOneBy({
                        id: countryId,
                        isDeleted: Boolean.False
                    });

                    if (country) {
                        resolve({
                            status: true,
                            result: country
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Country doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Country doesn't exists`
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

    deleteCountry(countryId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (countryId) {
                    const country = await this.countryRepository.findOneBy({
                        id: countryId
                    });

                    if (country) {
                        if (country.countryName == `International`) {
                            resolve({
                                status: false,
                                message: `International can not deleted`
                            });
                        }
                        else {
                            if (country.isDeleted == Boolean.True) {
                                country.isDeleted = Boolean.False;
                                await this.countryRepository.save(country);

                                resolve({
                                    status: true,
                                    message: `Country enabled successfully`
                                });
                            }
                            else {
                                country.isDeleted = Boolean.True;
                                await this.countryRepository.save(country);

                                resolve({
                                    status: true,
                                    message: `Country disabled successfully`
                                });
                            }
                        }
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Country doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Country doesn't exists`
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

    countryDetails(countryId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const country = await this.countryRepository.findOneBy({
                    id: countryId
                });

                if (country) {
                    resolve({
                        status: true,
                        result: country
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `Country doesn't exists`
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
