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

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export class TokenUtil {
  private static readonly ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your-access-secret-key';
  private static readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
  private static readonly ACCESS_EXPIRES_IN = '15m';
  private static readonly REFRESH_EXPIRES_IN = '7d';


  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.ACCESS_SECRET, {
      expiresIn: this.ACCESS_EXPIRES_IN,
      issuer: 'latex-fabrics',
      audience: 'users',
    });
  }

  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.REFRESH_SECRET, {
      expiresIn: this.REFRESH_EXPIRES_IN,
      issuer: 'latex-fabrics',
      audience: 'users',
    });
  }

  static generateTokenPair(payload: JwtPayload): TokenPair {
    return {
        accessToken: this.generateAccessToken(payload),
        refreshToken: this.generateRefreshToken(payload),
    }
  }

static verifyAccessToken(token: string): JwtPayload {
  try {
      const decoded = jwt.verify(token, this.ACCESS_SECRET, 
        {
            issuer: 'latex-fabrics',
            audience: 'users',
        }) as JwtPayload;
      return decoded;
  } catch (err) {
      throw new Error('Invalid access token');
        }
  }

    static verifyRefreshToken(token: string): JwtPayload {
        try{
            const decoded = jwt.verify(token, this.REFRESH_SECRET, 
            {
                issuer: 'latex-fabrics',
                audience: 'users',
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
