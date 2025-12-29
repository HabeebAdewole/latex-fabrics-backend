import crypto from 'crypto';
import { getRedisClient } from '../config/redis.config';
/*
 Generate a One-Time Password (OTP)
 store it in Redis with an expiration time
 verify the OTP against user input
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
    static async storeOtp(email: string, otpData: string, purpose: 'verification' | 'login'): Promise<string> {
        const redis = getRedisClient();
        const key = `otp:${purpose}:${email}`;
        await redis.setEx(key, this.OTP_EXPIRES_IN_MINUTES * 60, JSON.stringify(otpData));
        console.log(` OTP stored: ${key} (expires in 600s)`);

        return otpData;
    }
    static async verifyOtp( email: string, inputOtp: string, purpose: 'verification' | 'login' ): Promise<{ isValid: boolean; error?: string }> {
        const redis = getRedisClient();
        const key = `otp:${purpose}:${email}`;
        
        const otpDataString = await redis.get(key);
        if (!otpDataString) {
            return { isValid: false, error: 'OTP not found or expired' };
        }
        
        const otpData: OtpData = JSON.parse(otpDataString);
        
        if (otpData.attempts >= this.MAX_OTP_ATTEMPTS) {
            return { isValid: false, error: 'Maximum attempts exceeded' };
        }
        
        if (otpData.otp === inputOtp) {
            await redis.del(key);
            return { isValid: true };
        }
        
        otpData.attempts++;
        await redis.setEx(key, this.OTP_EXPIRES_IN_MINUTES * 60, JSON.stringify(otpData));
        return { isValid: false, error: 'Invalid OTP' };
    }
 }