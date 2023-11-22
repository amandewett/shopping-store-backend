import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import * as path from "path";
import { FileDeleteDto } from './dto/fileDelete.dto';

@Injectable()
export class FileService {
    constructor() { }

    uploadFile(file: Express.Multer.File) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const arrAllowedExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.mp4', '.mov', '.avi', '.mkv'];
                const allowedFileSize = Number(process.env.ALLOWED_FILE_SIZE) || 10000000;
                const fileDir = `./public/images`;
                const resFileDir = `./images`;

                if (!fs.existsSync(`./public`)) {
                    fs.mkdirSync(`./public`);
                }


                if (!fs.existsSync(fileDir)) {
                    fs.mkdirSync(fileDir);
                }

                const fileSize = file.size;
                if (fileSize > allowedFileSize) {
                    resolve({
                        status: false,
                        message: `File size exceeds 10MB`
                    });
                }
                else {
                    const fileExtension = path.extname(file.originalname);
                    if (arrAllowedExtensions.includes(fileExtension)) {
                        const fileName = `${Date.now()}_${file.originalname}`;
                        const filePath = `${fileDir}/${fileName}`;
                        const resFilePath = `${resFileDir}/${fileName}`;
                        fs.writeFile(filePath, file.buffer, (err) => {
                            if (err) {
                                console.log(err);
                                resolve({
                                    status: false,
                                    message: `Error in storing file, please check server logs`
                                });
                            }
                            else {
                                resolve({
                                    status: true,
                                    result: resFilePath
                                });
                            }
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `File type not allowed`
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

    deleteFile(data: FileDeleteDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const filePath = data.filePath.replace('.', '');
                const completeFilePath = `./public${filePath}`;

                if (fs.existsSync(completeFilePath)) {
                    fs.unlink(completeFilePath, (err) => {
                        if (err) {
                            console.log(err);
                            resolve({
                                status: false,
                                message: `Error in deleting file, please check server logs`
                            });
                        }
                        else {
                            resolve({
                                status: true,
                                message: `File deleted successfully`
                            });
                        }
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `File doesn't exists`
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
