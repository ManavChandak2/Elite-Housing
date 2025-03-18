import asyncHandler from 'express-async-handler';
import { prisma } from "../config/prismaConfig.js";

// ✅ Create Residency
export const createResidency = asyncHandler(async (req, res) => {
    const { title, description, price, address, country, city, facilities, userEmail, image } = req.body;

    console.log("Received Data:", req.body);

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: userEmail }
        });

        if (!existingUser) {
            return res.status(400).json({ message: "User does not exist. Please sign up first." });
        }

        const residency = await prisma.residency.create({
            data: {
                title,
                description,
                price,
                address,
                country,
                city,
                facilities: facilities ? JSON.parse(JSON.stringify(facilities)) : {}, 
                image,
                owner: { connect: { email: userEmail } }
            }
        });

        res.status(201).json({ message: 'Residency created successfully', residency });

    } catch (err) {
        console.error("Error:", err);

        if (err.code === 'P2002') {
            res.status(400).json({ message: 'Residency already exists' });
        } else {
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
});

// ✅ Get All Residencies
export const getAllResidencies = asyncHandler(async (req, res) => {
    try {
        const residencies = await prisma.residency.findMany({
            include: { owner: true }
        });

        res.status(200).json(residencies);

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

export const getResidency = asyncHandler(async (req, res) =>{
    const {id} = req.params;

    try{
        const residency = await prisma.residency.findUnique({
            where: { id: req.params.id.toString() } // ✅ Ensure ID is a String
        });
        res.send(residency)
    }catch(err){
        throw new Error(err.message)
    }
})