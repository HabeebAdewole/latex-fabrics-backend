import prisma from '../prisma';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { userSchema } from '../schema/user';
import { PasswordUtil } from '../utilities/password.util';
import{ TokenUtil, UserRole } from '../utilities/token';
import {v4 as uuidv4} from 'uuid';

dotenv.config();

export const registerUser = async (email: string, password: string, name: string, phoneNumber: string) => {
    const { error } = userSchema.validate({ email, password, name, phoneNumber });
    if (error) {
        throw new Error(error.details?.[0]?.message);
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing){
        throw new Error('User already exists');
    }
    const hashedPassword = await PasswordUtil.hashPassword(password);
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash: hashedPassword,
            name,
            phoneNumber,
            },
        });
        const tokens = TokenUtil.generateTokenPair({
            userId: user.id,
            email: user.email,
            role: UserRole.CUSTOMER,
        })
        await prisma.refreshToken.create({
            data: {
                id: uuidv4(),
                token: tokens.refreshToken
            }
        })

    return { user: { id: user.id, email: user.email, name: user.name, phoneNumber: user.phoneNumber }, tokens };
}

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({where: {email} });
    if (!user){
        throw new Error ('user not found ');
    }
    const isPasswordValid = await PasswordUtil.comparePassword(password, user.passwordHash);
    if (!isPasswordValid){
        throw new Error('Invalid password');
    }
    return {id: user.id, email: user.email, name: user.name};
}

export const getUserProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({where: {id: userId}});
    if (!user){
        throw new Error ('user not found');
    }
    return user;
}

export const logoutUser = async (userId: string) => {
    await prisma.refreshToken.deleteMany({where: {userId}});
    return {success: true};
}

