import { Injectable } from '@nestjs/common';
import * as sgMail from "@sendgrid/mail";

@Injectable()
export class EmailService {
    constructor() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
    }

    sendAccountVerificationOtp(customerEmail: string, customerName: string, otp: string) {
        const msg = {
            to: customerEmail,
            from: process.env.SENDGRID_EMAIL!,
            subject: `Welcome`,
            html: `<!DOCTYPE html>
                <html lang="en">               
                <body>
                    <div>Hello ${customerName},</div>
                    <div>Welcome to Shopping-store. Please use this OTP to verify your account.</div>
                    <div>OTP: ${otp}</div>
                </body>                
                </html>`,
        };
        sgMail.send(msg);
    }

    forgotPasswordOtp(customerEmail: string, customerName: string, otp: string) {
        const msg: sgMail.MailDataRequired = {
            to: customerEmail,
            from: process.env.SENDGRID_EMAIL!,
            subject: `Forgot Password`,
            html: `<!DOCTYPE html>
                <html lang="en">               
                <body>
                    <div>Hello ${customerName},</div>
                    <div>Please use this OTP to reset your account password.</div>
                    <div>OTP: ${otp}</div>
                </body>                
                </html>`,
        };
        sgMail.send(msg);
    }

    staffWelcomeEmail(staffEmail: string, staffName: string, password: string) {
        const msg = {
            to: staffEmail,
            from: process.env.SENDGRID_EMAIL!,
            subject: `Welcome`,
            html: `<!DOCTYPE html>
                <html lang="en">               
                <body>
                    <div>Hello ${staffName},</div>
                    <div>An account has been cerated on Shopping store. Please click on the <a href="${process.env.FRONT_HOST}">link</a> and use below credentials to login.</div>
                    <div>Email: ${staffEmail}</div>
                    <div>Password: ${password}</div>
                </body>                
                </html>`,
        };
        sgMail.send(msg);
    }
}
