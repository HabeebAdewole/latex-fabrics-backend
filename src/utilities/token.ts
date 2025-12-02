import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
import { JwtPayload } from 'jsonwebtoken';


export enum UserRole {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER',
}

export interface TokenPayload {
    userId: string;
    role: UserRole;
    email: string;
}
interface ResetTokenPayload extends JwtPayload {
    userId: string;
    email: string;
    purpose: 'password_reset';
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

/*
utility class for generating and verifying JWT tokens
includes methods for:
- generating access and refresh tokens with user payload
- generating password reset tokens
- verifying access, refresh, and password reset tokens
- decoding tokens without verification
- checking token expiration
*/

export class TokenUtil {
  private static readonly ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your-access-secret-key';
  private static readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
  private static readonly ACCESS_EXPIRES_IN = '15m';
  private static readonly REFRESH_EXPIRES_IN = '7d';

  private static readonly RESET_SECRET = process.env.JWT_RESET_SECRET || 'your-reset-secret-key';
  private static readonly RESET_EXPIRES_IN = '1h';
  
  private static readonly ISSUER = 'latex-fabrics';
  private static readonly AUDIENCE = 'users';


  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.ACCESS_SECRET, {
      expiresIn: this.ACCESS_EXPIRES_IN,
      issuer: this.ISSUER,
      audience: this.AUDIENCE,
    });
  }

  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.REFRESH_SECRET, {
      expiresIn: this.REFRESH_EXPIRES_IN,
      issuer: 'this.ISSUER',
      audience: this.AUDIENCE,
    });
  }

  static generateTokenPair(payload: JwtPayload): TokenPair {
    return {
        accessToken: this.generateAccessToken(payload),
        refreshToken: this.generateRefreshToken(payload),
    }
  }
  static generatePasswordResetToken(userId: string, email: string): string {
    const payload: ResetTokenPayload = {
      userId,
      email,
      purpose: 'password_reset'
    };

    return jwt.sign(payload, this.RESET_SECRET, {
      expiresIn: this.RESET_EXPIRES_IN,
      issuer: this.ISSUER,
      audience: this.AUDIENCE,
    });
  }

static verifyAccessToken(token: string): JwtPayload {
  try {
      const decoded = jwt.verify(token, this.ACCESS_SECRET, 
        {
            issuer: this.ISSUER,
            audience: this.AUDIENCE,
        }) as JwtPayload;
      return decoded;
  } catch (err) {
      throw new Error('Invalid access token');
        }
  }
  static verifyPasswordResetToken(token: string): ResetTokenPayload {
    try{
        const decoded = jwt.verify(token, this.RESET_SECRET, 
        {
            issuer: this.ISSUER,
            audience: this.AUDIENCE,
        }) as ResetTokenPayload;
        if(decoded.purpose !== 'password_reset'){
            throw new Error('Invalid token purpose');
        } 
        return decoded;
    }catch(err){
        throw new Error('Invalid password reset token');
    }
  }

    static verifyRefreshToken(token: string): JwtPayload {
        try{
            const decoded = jwt.verify(token, this.REFRESH_SECRET, 
            {
                issuer: this.ISSUER,
                audience: this.AUDIENCE,
            }) as JwtPayload;
            return decoded;
        }catch(err){
            throw new Error('Invalid refresh token');
        }
    }

    static decodeToken(token: string): JwtPayload | null {
        try{
            const decoded = jwt.decode(token) as JwtPayload | null;
            return decoded;
        }catch(err){
            return null;
        }
    }

    static isTokenExpired(token: string): boolean {
        try{ 
        const decoded = jwt.decode(token) as any;
        if(!decoded || !decoded.exp){
            return true;
        }
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
        }catch(err){
            return true;
        }
    }
}
