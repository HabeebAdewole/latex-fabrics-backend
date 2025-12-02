import crypto from 'crypto';
/*
 Generate a One-Time Password (OTP)
 length - Length of the OTP */



 export interface OtpData {
    otp: string;
    expiresAt: Date;
    attempts: number;
 }

 export class OtpUtil {
    private static readonly OTP_LENGTH = parseInt(process.env.OTP_LENGTH || '6', 10);
    private static readonly OTP_EXPIRES_IN_MINUTES = parseInt(process.env.OTP_EXPIRES_IN_MINUTES || '10', 10);
    private static readonly MAX_OTP_ATTEMPTS = parseInt(process.env.MAX_OTP_ATTEMPTS || '5', 10);

    static generateOtpCode(length: number = OtpUtil.OTP_LENGTH): string {
        let otp = '';
        for (let i  = 0; i< length; i++){
            otp +=crypto.randomInt(0,10).toString();
        }
        return otp;
    }
    static generateOtp(): OtpData {
        const code = this.generateOtpCode();
        const expiresAt = new Date;
        expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRES_IN_MINUTES);
        return{
            otp: code,
            expiresAt,
            attempts: 0, 
        }
    }
    static verifyOtp(inputOtp: string,){

    }
 }