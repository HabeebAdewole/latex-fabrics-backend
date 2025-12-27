import exprees from "express";
import cors from "cors";
import {prismaClient} from '@prisma/Client'
import dotenv from "dotenv";
dotenv.config();

export const  registerUser = async (req: exprees.Request, res: exprees.Response) => {
    const user = await prisma.findUnique({
        where
    })
}