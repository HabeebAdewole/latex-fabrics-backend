import { Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({ id: user.id, email: user.email });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message ?? error });
    }
};
export const loginUser = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
        if (!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }
        const user = await prisma.user.findUnique({where: {email}});
        if(!user){
            return res.status(401).json({message: "user not found"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid password"});
        }
        return res.status(200).json({id: user.id, email: user.email});
    }catch(error: any){
        return res.status(500).json({message: "Internal server error", error: error.message ?? error});
    }
};

// exort const getUserProfile = async (req: Request, res: Response) => 

export const logoutUser = async (req: Request, res: Response) => {
    try{
        // Invalidate user session or token here (implementation depends on your auth strategy)
        return res.status(200).json({message: "User logged out successfully"});
    }catch(error: any){
        return res.status(500).json({message: "Internal server error", error: error.message ?? error});
    }
}